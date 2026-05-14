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
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h1>Priority Inbox</h1>
      <label>Show Top: <input type="number" value={topN} min={1} max={50}
        onChange={e => setTopN(Number(e.target.value))}
        style={{ width: 60, marginLeft: 8, padding: "4px 8px", borderRadius: 4 }} />
      </label>
      <div style={{ marginTop: 16 }}>
        {loading ? <h3>Loading...</h3> : displayed.map((n, i) => (
          <NotificationCard key={n.ID} notification={n} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}