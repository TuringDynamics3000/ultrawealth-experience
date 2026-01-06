export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <div style={{
        background: "#111",
        color: "#fff",
        padding: "6px 10px",
        fontSize: 12,
        marginBottom: 20
      }}>
        SIMULATION MODE — No backend, no auth, no real data
      </div>

      <h1>UltraWealth Experience</h1>

      <p>
        This repository is a frontend-only experience shell.
        Backend functionality is intentionally stubbed or removed.
      </p>

      <ul>
        <li>No tRPC</li>
        <li>No auth hooks</li>
        <li>No Tailwind</li>
        <li>No shared backend libs</li>
      </ul>
    </div>
  );
}
