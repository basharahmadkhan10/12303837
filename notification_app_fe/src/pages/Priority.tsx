import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { fetchNotifications, logEvent } from "../api/notificationApi";

const TYPE_WEIGHT: Record<string, number> = { Placement: 3, Event: 2, Result: 1 };

function score(n: any) {
  const w = TYPE_WEIGHT[n.Type] ?? 1;
  const age = Date.now() - new Date(n.Timestamp).getTime();
  const recency = Math.max(0, 1 - age / (30 * 24 * 3600 * 1000));
  return w * 1000 + recency * 999;
}

export default function Priority() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    const load = async () => {
      await logEvent("frontend", "info", "page", "Loading priority notifications");
      const data = await fetchNotifications();
      const sorted = [...data].sort((a, b) => score(b) - score(a));
      setNotifications(sorted);
      setLoading(false);
    };
    load();
  }, []);

  const displayed = notifications.slice(0, topN);

  return (
    <div style={{
      maxWidth: 780,
      margin: "0 auto",
      padding: "48px 24px 80px",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#fff",
      minHeight: "100vh",
    }}>
      {/* Header */}
      <div style={{ borderBottom: "3px solid #000", paddingBottom: 16, marginBottom: 32 }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-1px",
          margin: 0,
          lineHeight: 1.1,
          color: "#000",
          fontFamily: "'Georgia', serif",
        }}>
          Priority Inbox
        </h1>
        <p style={{
          fontSize: 11,
          color: "#888",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "0.1em",
          marginTop: 6,
          textTransform: "uppercase",
        }}>
          Ranked by type weight &amp; recency
        </p>
      </div>

      {/* Top N control */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid #ddd",
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: "#555",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Show Top
        </span>
        <input
          type="number"
          value={topN}
          min={1}
          max={50}
          onChange={(e) => setTopN(Number(e.target.value))}
          style={{
            width: 56,
            padding: "4px 8px",
            border: "1px solid #000",
            borderRadius: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: "#000",
            background: "#fff",
            outline: "none",
            textAlign: "center",
          }}
        />
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: "#aaa",
          letterSpacing: "0.08em",
        }}>
          of {notifications.length} total
        </span>
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#aaa", letterSpacing: "0.1em" }}>
          LOADING...
        </p>
      ) : displayed.length === 0 ? (
        <p style={{ fontFamily: "'Georgia', serif", color: "#aaa", fontSize: 14, marginTop: 40, textAlign: "center" }}>
          No notifications found.
        </p>
      ) : (
        <div>
          {displayed.map((n, i) => (
            <NotificationCard key={n.ID} notification={n} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}