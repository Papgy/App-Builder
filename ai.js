async function askAI(prompt) {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`API error: ${data.error?.message || response.status}`);
  }

  return data.choices?.[0]?.message?.content || "No reply from AI.";
}
