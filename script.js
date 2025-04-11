import { pipeline } from '@huggingface/transformers';
const classifier = await pipeline('text-generation');

let generator;
window.generatedFiles = {};

async function loadAI() {
  if (!generator) {
    generator = await classifier('Xenova/distilgpt2');
  }
  return generator;
}

window.generateApp = async function () {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return alert("Please enter an app description!");

  const prompt = `Generate code for the following app idea:\n"${input}". Respond in this format:\n---HTML---\n<your html>\n---CSS---\n<your css>\n---JS---\n<your js>\n(optional: add PYTHON, TS, etc.)`;

  const gen = await loadAI();
  const output = await gen(prompt, { max_new_tokens: 500 });
  const text = output[0].generated_text;

  parseGeneratedFiles(text);
  updatePreview();
};

function parseGeneratedFiles(rawText) {
  window.generatedFiles = {};
  const sections = rawText.split(/---([A-Z]+)---/g).filter(Boolean);

  for (let i = 0; i < sections.length; i += 2) {
    const type = sections[i].toLowerCase();
    const content = sections[i + 1]?.trim() || '';
    window.generatedFiles[type] = content;
  }
}

window.updatePreview = function () {
  const html = window.generatedFiles['html'] || '';
  const css = window.generatedFiles['css'] || '';
  const js = window.generatedFiles['js'] || '';

  const full = `
<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>
${html}
<script>
try {
${js}
} catch(e) {
  document.body.innerHTML += '<pre style="color:red;">JS Error: ' + e + '</pre>';
}
<\/script>
</body>
</html>`;

  document.getElementById("previewFrame").srcdoc = full;
};

window.switchTab = function (tab) {
  document.getElementById('previewTab').classList.toggle('hidden', tab !== 'preview');
  document.getElementById('workspaceTab').classList.toggle('hidden', tab !== 'workspace');
  document.getElementById('tabPreview').classList.toggle('text-blue-600', tab === 'preview');
  document.getElementById('tabWorkspace').classList.toggle('text-blue-600', tab === 'workspace');

  if (tab === 'workspace') renderWorkspace();
};

function renderWorkspace() {
  const container = document.getElementById("dynamicCodeBlocks");
  container.innerHTML = '';

  for (const [lang, content] of Object.entries(window.generatedFiles)) {
    const langLabel = lang.toUpperCase();
    const color = lang === 'html' ? 'blue' : lang === 'css' ? 'green' : lang === 'js' ? 'yellow' : 'gray';

    const block = document.createElement("div");
    block.className = "bg-white p-4 rounded shadow";
    block.innerHTML = `
      <h3 class="font-semibold text-${color}-600 mb-2">📄 ${langLabel}</h3>
      <pre class="bg-gray-100 p-2 text-sm font-mono overflow-auto h-64 rounded whitespace-pre-wrap">${content}</pre>
    `;
    container.appendChild(block);
  }
}
