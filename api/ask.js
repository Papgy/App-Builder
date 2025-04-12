export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  const OPENROUTER_API_KEY = "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";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://your-username.github.io/",
      "X-Title": "AI App Builder"
    },
    body: JSON.stringify({
      model: "moonshot-ai/moonshot-v1-128k",
      messages: [
        { role: "system", content: "You generate web app project code in markdown code blocks." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
