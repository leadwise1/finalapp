declare const puter: any;

export const generateText = async (prompt: string, options: any = {}) => {
    try {
      const response = await (puter as any).ai.chat(prompt, {
        model: options.model || "gpt-5-nano",
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 200
      });
      return response;
    } catch (error) {
      console.error("Puter AI error:", error);
      return "AI failed to generate a response. Please try again.";
    }
  };