function downloadFilesAsZip(files) {
  const zip = new JSZip();
  files.forEach(file => {
    zip.file(file.filename, file.content);
  });
  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "app.zip";
    a.click();
  });
}
