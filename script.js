import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0';

let generator;

async function loadAI() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/phi-1_5', {
      progress_callback: () => {},
      config: { logLevel: 'error' }
    });
  }
  return generator;
}

window.generateApp = async function () {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return alert("Please enter an app description!");

  const prompt = `Generate HTML, CSS, and JS code for the following app idea:\n"${input}". Respond in this format:\n---HTML---\n<your html>\n---CSS---\n<your css>\n---JS---\n<your js>`;
  const gen = await loadAI();
  const output = await gen(prompt, { max_new_tokens: 400 });
  const text = output[0].generated_text;

  const html = text.split('---HTML---')[1]?.split('---CSS---')[0]?.trim() || '';
  const css = text.split('---CSS---')[1]?.split('---JS---')[0]?.trim() || '';
  const js = text.split('---JS---')[1]?.trim() || '';

  document.getElementById("htmlCode")?.remove(); // Not shown in UI, but cleanup if exists
  document.getElementById("cssCode")?.remove();
  document.getElementById("jsCode")?.remove();

  window.generatedHTML = html;
  window.generatedCSS = css;
  window.generatedJS = js;

  updatePreview();
};

window.updatePreview = function () {
  const html = window.generatedHTML || '';
  const css = window.generatedCSS || '';
  const js = window.generatedJS || '';

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
  document.getElementById("codeHTML").textContent = window.generatedHTML || '';
  document.getElementById("codeCSS").textContent = window.generatedCSS || '';
  document.getElementById("codeJS").textContent = window.generatedJS || '';
}
