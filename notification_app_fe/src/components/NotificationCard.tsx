interface Props {
  notification: any;
  rank?: number;
  isNew?: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  Placement: "#e6a823",
  Event: "#25df76",
  Result: "#bd2d05",
};

export default function NotificationCard({ notification, rank, isNew }: Props) {
  return (
    <div style={{
      border: isNew ? "2px solid #1565c0" : "1px solid #ddd",
      borderRadius: 8, padding: "12px 16px", marginBottom: 10,
      background: isNew ? "#e3f2fd" : "white",
      display: "flex", gap: 12, alignItems: "center"
    }}>
      {rank && <span style={{ fontWeight: 700, color: rank <= 3 ? "#ff6f00" : "#999", minWidth: 28 }}>#{rank}</span>}
      <span style={{ background: TYPE_COLOR[notification.Type] ?? "#666", color: "white", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>
        {notification.Type}
      </span>
      {isNew && <span style={{ color: "#1565c0", fontSize: 11, fontWeight: 700, border: "1px solid #1565c0", borderRadius: 4, padding: "1px 6px" }}>NEW</span>}
      <span style={{ flex: 1 }}>{notification.Message}</span>
      <span style={{ color: "#999", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(notification.Timestamp).toLocaleString()}</span>
    </div>
  );
}