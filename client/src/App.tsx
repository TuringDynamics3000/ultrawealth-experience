import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shell from "./layout/Shell";
import Overview from "./pages/Overview";
import Goals from "./pages/Goals";
import Walkthrough from "./pages/Walkthrough";

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/walkthrough" element={<Walkthrough />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
