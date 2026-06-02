import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import BayesTheorem from "./pages/BayesTheorem";
import PerfectSecrecy from "./pages/PerfectSecrecy";
import ModesVisualizer from "./pages/ModesVisualizer";
import AttackSimulator from "./pages/AttackSimulator";
import Practice from "./pages/Practice";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/bayes-theorem" element={<BayesTheorem />} />
          <Route path="/perfect-secrecy" element={<PerfectSecrecy />} />
          <Route path="/modes" element={<ModesVisualizer />} />
          <Route path="/attack-simulator" element={<AttackSimulator />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;