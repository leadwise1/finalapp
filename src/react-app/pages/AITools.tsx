// src/react-app/pages/CareerAIPage.tsx
import React from "react";
import ResumeGenerator from "../components/ResumeGenerator";
import CareerCoach from "../components/CareerCoach";

const CareerAIPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Career AI</h1>
      <ResumeGenerator />
      <CareerCoach />
    </div>
  );
};

export default CareerAIPage;