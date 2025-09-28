import React, { useState } from "react";

interface CareerCoachProps {
  question?: string; // question is optional
}

const CareerCoach: React.FC<CareerCoachProps> = ({ question }) => {
  const [response, setResponse] = useState<string>("");

  const handleAsk = async () => {
    if (!question) return;
    try {
      // Example fetch to your AI backend (adjust URL if needed)
      const res = await fetch("/api/career-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");
      const data = await res.json();
      setResponse(data.answer || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong while fetching AI response.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">Career AI Coach</h2>

      {question && (
        <p className="mb-4 text-gray-700">
          <strong>Question:</strong> {question}
        </p>
      )}

      <button
        onClick={handleAsk}
        className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-violet-700 transition"
      >
        Ask AI
      </button>

      {response && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-gray-800">
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default CareerCoach;