const OPENROUTER_API_KEY = "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"; // Replace with your key

async function askAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}
