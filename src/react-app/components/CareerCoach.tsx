import { useState } from "react";
import { generateText } from "../utils/puterAI";

const CareerCoach = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    setAnswer("Thinking...");
    const aiResponse = await generateText(
      `Provide personalized career advice for the following question:\n${question}`,
      { model: "gpt-5-chat-latest", max_tokens: 250 }
    );
    setAnswer(aiResponse);
  };

  return (
    <div className="p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">AI Career Coach</h2>
      <input
        type="text"
        className="w-full border p-2 mb-2"
        placeholder="Ask a career question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleAsk}
      >
        Get Advice
      </button>
      {answer && (
        <div className="mt-4 p-2 border bg-gray-100 rounded whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
};

export default CareerCoach;