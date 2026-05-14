const API = "/evaluation-service"; // Replace with your actual API endpoint
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiYXNoYXJraGFuMjRrQGdtYWlsLmNvbSIsImV4cCI6MTc3ODc2NDM1OCwiaWF0IjoxNzc4NzYzNDU4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmY4NjRiMjgtNzM3NC00YTg0LWIxNWItMmIyZjA3NWY3ZTZkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYmFzaGFyIGFobWFkIGtoYW4iLCJzdWIiOiJjNWI5OWI2Ni1kMjc0LTQ5MWYtYmFkYy1iNDUzYTA3ODNmMzQifSwiZW1haWwiOiJiYXNoYXJraGFuMjRrQGdtYWlsLmNvbSIsIm5hbWUiOiJiYXNoYXIgYWhtYWQga2hhbiIsInJvbGxObyI6IjEyMzAzODM3IiwiYWNjZXNzQ29kZSI6IlRSdlpXcSIsImNsaWVudElEIjoiYzViOTliNjYtZDI3NC00OTFmLWJhZGMtYjQ1M2EwNzgzZjM0IiwiY2xpZW50U2VjcmV0IjoicVllWkFQZGVNS0RVenFWYyJ9.UjEEUeAwa0Vc6IMX2C7UPMM85O0jJ7CaqXOWeU3ZK8s"; 

export const fetchNotifications = async (type?: string) => {
  try {
    const url = new URL(`${API}/notifications`, window.location.origin);
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

export const logEvent = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
) => {
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