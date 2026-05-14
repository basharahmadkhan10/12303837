const API = "http://4.224.186.213/evaluation-service";
const TOKEN = "APNA_TOKEN_YAHAN_DAALO";

export const fetchNotifications = async (type?: string) => {
  try {
    const url = new URL(`${API}/notifications`);
    if (type) url.searchParams.set("notification_type", type);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await res.json();
    return data.notifications ?? [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const logEvent = async (stack: string, level: string, pkg: string, message: string) => {
  try {
    await fetch(`${API}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch {}
};