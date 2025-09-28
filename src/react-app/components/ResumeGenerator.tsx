// Puter.js global declaration
declare const puter: any;

import { useState } from "react";

// Helper to wait for Puter.js to load
const waitForPuter = async () => {
  while (typeof puter === 'undefined' || !puter.ai) {
    await new Promise((r) => setTimeout(r, 50));
  }
};

const ResumeGenerator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setOutput("Generating...");
    try {
      await waitForPuter();
      const prompt = `Create professional resume bullet points for the following experience:\n${input}`;
      const aiResponse = await puter.ai.chat(prompt, { model: "gpt-5-chat-latest", max_tokens: 500 });
      setOutput(aiResponse);
    } catch (error) {
      console.error("AI call failed:", error);
      setOutput("Failed to generate resume. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">AI Resume Builder</h2>
      <textarea
        className="w-full border p-2 mb-2"
        rows={5}
        placeholder="Enter your job experience..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleGenerate}
      >
        Generate Resume Points
      </button>
      {output && (
        <div className="mt-4 p-2 border bg-gray-100 rounded whitespace-pre-line">
          {output}
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;