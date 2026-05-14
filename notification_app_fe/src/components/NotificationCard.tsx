interface Props {
  notification: any;
  rank?: number;
  isNew?: boolean;
}

const TYPE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  Placement: { bg: "#000", color: "#fff", label: "PLACEMENT" },
  Event:     { bg: "#fff", color: "#000", label: "EVENT" },
  Result:    { bg: "#444", color: "#fff", label: "RESULT" },
};

export default function NotificationCard({ notification, rank, isNew }: Props) {
  const typeStyle = TYPE_STYLE[notification.Type] ?? { bg: "#222", color: "#fff", label: notification.Type };

  return (
    <div style={{
      borderTop: "1px solid #000",
      borderBottom: isNew ? "2px solid #000" : "1px solid transparent",
      padding: "14px 0",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      background: isNew ? "#f5f5f5" : "transparent",
      paddingLeft: isNew ? 12 : 0,
      paddingRight: isNew ? 12 : 0,
      transition: "background 0.2s",
      position: "relative",
    }}>

      {/* Left: rank or dot */}
      <div style={{
        minWidth: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 2,
      }}>
        {rank ? (
          <span style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            fontSize: 13,
            color: rank <= 3 ? "#000" : "#aaa",
            letterSpacing: "-0.5px",
          }}>
            {String(rank).padStart(2, "0")}
          </span>
        ) : (
          <span style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: isNew ? "#000" : "#ccc",
            display: "inline-block",
            marginTop: 6,
          }} />
        )}
      </div>

      {/* Middle: type badge + message */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            background: typeStyle.bg,
            color: typeStyle.color,
            border: "1px solid #000",
            borderRadius: 0,
            padding: "2px 7px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            fontFamily: "'Courier New', monospace",
            textTransform: "uppercase",
          }}>
            {typeStyle.label}
          </span>

          {isNew && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#000",
              fontFamily: "'Courier New', monospace",
              borderBottom: "1px solid #000",
              paddingBottom: 1,
            }}>
              ● NEW
            </span>
          )}
        </div>

        <p style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          color: "#111",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "0.01em",
        }}>
          {notification.Message}
        </p>
      </div>

      {/* Right: timestamp */}
      <span style={{
        color: "#888",
        fontSize: 11,
        whiteSpace: "nowrap",
        fontFamily: "'Courier New', monospace",
        paddingTop: 3,
        letterSpacing: "0.04em",
      }}>
        {new Date(notification.Timestamp).toLocaleString(undefined, {
          month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}
      </span>
    </div>
  );
}