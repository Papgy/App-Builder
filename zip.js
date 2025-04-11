function downloadProject() {
  const zip = new JSZip();

  for (const [type, content] of Object.entries(window.generatedFiles)) {
    const ext = getExtension(type);
    const filename = `main.${ext}`;
    zip.file(filename, content);
  }

  zip.file("README.md", "# AI App Builder Project\nGenerated using the AI App Builder interface.");

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "ai-app.zip";
    link.click();
  });
}

function getExtension(type) {
  switch (type.toLowerCase()) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'js';
    case 'python': return 'py';
    case 'ts': return 'ts';
    case 'json': return 'json';
    default: return type.toLowerCase();
  }
}
