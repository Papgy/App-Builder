function downloadProject() {
  const zip = new JSZip();

  for (const [filename, content] of Object.entries(window.generatedFiles)) {
    zip.file(filename, content);
  }

  zip.file("README.md", "# AI App Builder Project\nGenerated with AI App Builder");
  zip.generateAsync({ type: "blob" }).then((content) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "ai-app.zip";
    link.click();
  });
}
