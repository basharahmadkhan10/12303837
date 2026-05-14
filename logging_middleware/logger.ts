const BASE_URL = "evaluation-service";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type SharedPackage = "auth" | "config" | "middleware" | "utils";
type Package = BackendPackage | FrontendPackage | SharedPackage;

interface LogPayload {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

interface LogResponse {
  logID: string;
  message: string;
}

// Store auth token in memory
let authToken: string | null = null;

export function setAuthToken(token: string): void {
  authToken = token;
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  if (!authToken) {
    console.warn("[Logger] No auth token set. Call setAuthToken() first.");
    return null;
  }

  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Logger] Failed to send log: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: LogResponse = await response.json();
    return data;
  } catch (err) {
    console.error("[Logger] Network error while sending log:", err);
    return null;
  }
}

export default Log;