

import React from "react";
import ResumeGenerator from "../components/ResumeGenerator";
import CareerCoach from "../components/CareerCoach";

const AITools: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
      <ResumeGenerator />
      <CareerCoach />
    </div>
  );
};

export default AITools;