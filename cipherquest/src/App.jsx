import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import ProbabilityBasics from "./pages/ProbabilityBasics";
import BayesTheorem from "./pages/BayesTheorem";
import PerfectSecrecy from "./pages/PerfectSecrecy";
import OneTimePad from "./pages/OneTimePad";
import ModesVisualizer from "./pages/ModesVisualizer";
import AttackSimulator from "./pages/AttackSimulator";
import CpaSecurity from "./pages/CpaSecurity";
import Macs from "./pages/Macs";
import HashFunctions from "./pages/HashFunctions";
import Practice from "./pages/Practice";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/probability-basics" element={<ProbabilityBasics />} />
          <Route path="/bayes-theorem" element={<BayesTheorem />} />
          <Route path="/perfect-secrecy" element={<PerfectSecrecy />} />
          <Route path="/one-time-pad" element={<OneTimePad />} />
          <Route path="/modes" element={<ModesVisualizer />} />
          <Route path="/attack-simulator" element={<AttackSimulator />} />
          <Route path="/cpa-security" element={<CpaSecurity />} />
          <Route path="/macs" element={<Macs />} />
          <Route path="/hash-functions" element={<HashFunctions />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
