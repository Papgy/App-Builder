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
  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  try {
    const response = await fetch("https://app-builderp.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const generated = data.output;

    // Show raw code in workspace
    document.getElementById("codeOutput").textContent = generated;

    // Inject HTML into preview (use with caution)
    document.getElementById("previewFrame").srcdoc = generated;

    switchTab('workspace');
  } catch (error) {
    console.error("Failed to fetch:", error);
    alert("Something went wrong while contacting the API. Please try again.");
  }
}
