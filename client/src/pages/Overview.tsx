import { demoUser } from "../data/demoData";

export default function Overview() {
  return (
    <>
      <h1>Welcome, {demoUser.name}</h1>
      <p>
        This is a simulation of a goal-based wealth experience.
        No real money, trades, or accounts exist.
      </p>
    </>
  );
}
