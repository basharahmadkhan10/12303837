import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { fetchNotifications, logEvent } from "../api/notificationApi";

export default function Home() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const seenIds = useState<Set<string>>(() => new Set())[0];

  const load = async (type?: string) => {
    setLoading(true);
    await logEvent("frontend", "info", "page", "Loading all notifications");
    const data = await fetchNotifications(type);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    load(e.target.value || undefined);
  };

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h1>All Notifications</h1>
      <select value={filter} onChange={handleFilter} style={{ marginBottom: 16, padding: "6px 12px", borderRadius: 4 }}>
        <option value="">All Types</option>
        <option value="Event">Event</option>
        <option value="Result">Result</option>
        <option value="Placement">Placement</option>
      </select>
      {loading ? <h3>Loading...</h3> : notifications.map((n, i) => (
        <NotificationCard key={n.ID} notification={n} isNew={!seenIds.has(n.ID)} />
      ))}
    </div>
  );
}