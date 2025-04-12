const tabs = {
  preview: document.getElementById('previewTab'),
  workspace: document.getElementById('workspaceTab'),
};

function switchTab(tabName) {
  for (let tab in tabs) {
    tabs[tab].style.display = tab === tabName ? 'block' : 'none';
  }
}

async function generateCode() {
  const prompt = document.getElementById("promptInput").value;
  if (!prompt.trim()) return alert("Please enter a prompt.");

  const response = await fetch("https://app-builderp.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "true" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  const generated = data.output;

  // Show raw code in workspace
  document.getElementById("codeOutput").textContent = generated;

  // Optionally inject into preview (if it’s HTML-ish)
  const frame = document.getElementById("previewFrame");
  frame.srcdoc = generated;

  // Default to workspace tab
  switchTab('workspace');
}
