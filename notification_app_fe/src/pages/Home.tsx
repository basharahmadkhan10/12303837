import { useCallback, useEffect, useRef, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { fetchNotifications, logEvent } from "../api/notificationApi";

const pageStyle: React.CSSProperties = {
  maxWidth: 780,
  margin: "0 auto",
  padding: "48px 24px 80px",
  fontFamily: "'Georgia', 'Times New Roman', serif",
  background: "#ffffff",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  borderBottom: "3px solid #000",
  paddingBottom: 16,
  marginBottom: 32,
};

const titleStyle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: "-1px",
  margin: 0,
  lineHeight: 1.1,
  color: "#000",
  fontFamily: "serif",
  borderRadius: '2px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#888",
  fontFamily: "'Courier New', monospace",
  letterSpacing: "0.1em",
  marginTop: 6,
  textTransform: "uppercase" as const,
};

export default function Home() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const seenIds = useRef<Set<string>>(new Set());

  const load = useCallback(async (type?: string) => {
    setLoading(true);
    await logEvent("frontend", "info", "page", "Loading all notifications");
    const data = await fetchNotifications(type);
    setNotifications(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFilter = (type: string) => {
    setFilter(type);
    load(type || undefined);
  };

  const tabs = ["All", "Event", "Result", "Placement"];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Notifications</h1>
        <p style={subtitleStyle}>
          {new Date().toLocaleDateString(undefined, {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
          &nbsp;·&nbsp;{notifications.length} items
        </p>
      </div>

      {/* Tab Filter */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #000" }}>
        {tabs.map((tab) => {
          const val = tab === "All" ? "" : tab;
          const active = filter === val;
          return (
            <button
              key={tab}
              onClick={() => handleFilter(val)}
              style={{
                background: active ? "#000" : "transparent",
                color: active ? "#fff" : "#888",
                border: "none",
                borderTop: active ? "2px solid #000" : "2px solid transparent",
                padding: "8px 18px",
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#aaa", letterSpacing: "0.1em" }}>
          LOADING...
        </p>
      ) : notifications.length === 0 ? (
        <p style={{ fontFamily: "'Georgia', serif", color: "#aaa", fontSize: 14, marginTop: 40, textAlign: "center" }}>
          No notifications found.
        </p>
      ) : (
        <div>
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isNew={!seenIds.current.has(n.ID)}
            />
          ))}
        </div>
      )}
    </div>
  );
}