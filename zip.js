function downloadProject() {
  const html = window.generatedHTML || '';
  const css = window.generatedCSS || '';
  const js = window.generatedJS || '';

  const zip = new JSZip();

  zip.file("index.html", generateHTMLWrapper(html, css, js));
  zip.file("style.css", css);
  zip.file("script.js", js);
  zip.file("README.md", "# AI App Builder Project\nGenerated with the AI App Builder");

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "ai-app.zip";
    link.click();
  });
}

function generateHTMLWrapper(bodyHTML, css, js) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Generated App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${bodyHTML}
<script src="script.js"></script>
</body>
</html>`;
}
