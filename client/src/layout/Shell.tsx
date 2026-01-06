import { Link } from "react-router-dom";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#111", color: "#fff", padding: "10px 16px" }}>
        <strong>UltraWealth</strong> — Simulation Mode
      </div>

      <nav style={{ padding: 16 }}>
        <Link to="/" style={{ marginRight: 16 }}>Overview</Link>
        <Link to="/goals" style={{ marginRight: 16 }}>Goals</Link>
        <Link to="/walkthrough">Investor Walkthrough</Link>
      </nav>

      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
