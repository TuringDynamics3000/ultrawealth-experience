import { demoGoals } from "../data/demoData";

export default function Goals() {
  return (
    <>
      <h1>Your Goals</h1>
      <ul>
        {demoGoals.map(g => (
          <li key={g.id} style={{ marginBottom: 12 }}>
            <strong>{g.name}</strong><br />
            Target: ${g.target.toLocaleString()}<br />
            Progress: {(g.progress * 100).toFixed(0)}%
          </li>
        ))}
      </ul>
    </>
  );
}
