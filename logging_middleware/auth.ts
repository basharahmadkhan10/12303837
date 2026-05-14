const BASE_URL = "http://4.224.186.213/evaluation-service";

interface RegisterPayload {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}

interface RegisterResponse {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

interface AuthPayload {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Registration failed: ${res.status}`);
  return res.json();
}

export async function authenticate(payload: AuthPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  return res.json();
}