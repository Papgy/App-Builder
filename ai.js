const OPENROUTER_API_KEY = "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";

async function askAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://yourusername.github.io/", // change to your GitHub Pages URL
      "X-Title": "AI App Builder"
    },
    body: JSON.stringify({
      model: "moonshot-ai/moonshot-v1-128k",
      messages: [
        { role: "system", content: "You're an expert AI app builder that generates complete code projects." },
        { role: "user", content: prompt }
      ]
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`API Error: ${data.error?.message || response.status}`);
  }

  return data.choices?.[0]?.message?.content || "No response from AI.";
}
