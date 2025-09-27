import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import Resume from "@/react-app/pages/Resume";
import CoverLetter from "@/react-app/pages/CoverLetter";
import Coaching from "@/react-app/pages/Coaching";
import ATSOptimizer from "@/react-app/pages/ATSOptimizer";
import LinkedInOptimizer from "@/react-app/pages/LinkedInOptimizer";
import InterviewSimulator from "@/react-app/pages/InterviewSimulator";
import Templates from "@/react-app/pages/Templates";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/ats-optimizer" element={<ATSOptimizer />} />
        <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
        <Route path="/interview-simulator" element={<InterviewSimulator />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>
    </Router>
  );
}
