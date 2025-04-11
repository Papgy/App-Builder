import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0';

let generator;

async function loadAI() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/distilgpt2');
  }
  return generator;
}

// Make it global
window.generateApp = async function () {
  const input = document.getElementById("userInput").value.trim();
  const prompt = `Generate HTML, CSS, and JS code for the following app idea:\n"${input}". Respond in this format:\n---HTML---\n<your html>\n---CSS---\n<your css>\n---JS---\n<your js>`;

  const generator = await loadAI();
  const output = await generator(prompt, { max_new_tokens: 400 });
  const text = output[0].generated_text;

  const html = text.split('---HTML---')[1]?.split('---CSS---')[0]?.trim() || '';
  const css = text.split('---CSS---')[1]?.split('---JS---')[0]?.trim() || '';
  const js = text.split('---JS---')[1]?.trim() || '';

  document.getElementById("htmlCode").value = html;
  document.getElementById("cssCode").value = css;
  document.getElementById("jsCode").value = js;

  window.updatePreview(); // Ensure it's also globally available
};

window.updatePreview = function () {
  const html = document.getElementById("htmlCode").value;
  const css = document.getElementById("cssCode").value;
  const js = document.getElementById("jsCode").value;

  const full = `
<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;

  document.getElementById("previewFrame").srcdoc = full;
};

window.suggestFix = async function () {
  const lineNum = parseInt(document.getElementById("lineNumber").value);
  const type = document.getElementById("codeType").value;
  const editor = document.getElementById(`${type}Code`);
  const code = editor.value.split("\n");
  const line = code[lineNum - 1] || "Line not found.";

  const prompt = `This is a ${type.toUpperCase()} line: "${line}". Suggest a fix or improvement.`;

  document.getElementById("fixOutput").innerText = "💭 Thinking...";
  const generator = await loadAI();
  const response = await generator(prompt, { max_new_tokens: 100 });

  document.getElementById("fixOutput").innerText = response[0].generated_text;
};
