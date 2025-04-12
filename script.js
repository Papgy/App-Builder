let currentFiles = [];

document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("promptInput").value;
  const rawResponse = await askAI(`Generate an app based on this idea:\n${prompt}\nWrap all code in markdown-style code blocks.`);
  currentFiles = extractCodeBlocks(rawResponse);
  renderWorkspace(currentFiles);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (currentFiles.length === 0) return alert("No files to download!");
  downloadFilesAsZip(currentFiles);
});
