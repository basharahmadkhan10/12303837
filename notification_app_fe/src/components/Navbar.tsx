import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Notify</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>All Notifications</Link>
        <Link to="/priority" style={styles.link}>Priority Inbox</Link>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#000000", color: "white" },
  logo: { margin: 0, color: "white" },
  links: { display: "flex", gap: 24 },
  link: { color: "white", textDecoration: "none", fontWeight: 600 },
};