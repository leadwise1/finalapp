import { useState } from "react";
import { generateText } from "../utils/puterAI";

const ResumeGenerator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    setOutput("Generating...");
    const prompt = `Create professional resume bullet points for the following experience:\n${input}`;
    const aiResponse = await generateText(prompt, { model: "gpt-5-chat-latest" });
    setOutput(aiResponse);
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