function renderWorkspace(files) {
  const container = document.getElementById("workspace");
  container.innerHTML = "";
  files.forEach(file => {
    const div = document.createElement("div");
    div.className = "bg-gray-800 p-4 rounded shadow";
    div.innerHTML = `<div class="font-mono text-sm mb-2">${file.filename}</div>
      <pre class="whitespace-pre-wrap text-sm bg-gray-900 p-2 rounded overflow-auto">${file.content}</pre>`;
    container.appendChild(div);
  });
}
