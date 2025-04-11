import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0';

let generator;
window.generatedFiles = {};

async function loadAI() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/opt-125m', {
      progress_callback: () => {},
      config: { logLevel: 'error' }
    });
  }
  return generator;
}

window.generateApp = async function () {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return alert("Please enter an app description!");

  const prompt = `Generate code for the following app idea:\n"${input}". Respond in the format:\n---filename.ext---\n<file content>`;
  const gen = await loadAI();
  const output = await gen(prompt, { max_new_tokens: 500 });
  parseGeneratedFiles(output[0].generated_text);
  updatePreview();
};

function parseGeneratedFiles(rawText) {
  window.generatedFiles = {};
  const parts = rawText.split(/---(.*?)---/g).filter(Boolean);
  for (let i = 0; i < parts.length; i += 2) {
    const filename = parts[i].trim();
    const content = parts[i + 1]?.trim() || '';
    if (filename) window.generatedFiles[filename] = content;
  }
}

window.updatePreview = function () {
  const html = window.generatedFiles['index.html'] || '';
  const css = window.generatedFiles['style.css'] || '';
  const js = window.generatedFiles['script.js'] || '';

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
  if (tab === 'workspace') renderFileTree();
};

function renderFileTree() {
  const treeContainer = document.getElementById("fileTree");
  treeContainer.innerHTML = '';
  const fileMap = buildFileTree(window.generatedFiles);
  treeContainer.appendChild(renderTreeNodes(fileMap, ''));
}

function buildFileTree(files) {
  const tree = {};
  for (const path in files) {
    const parts = path.split('/');
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = i === parts.length - 1 ? files[path] : {};
      }
      current = current[part];
    }
  }
  return tree;
}

function renderTreeNodes(tree, path) {
  const fragment = document.createElement("div");

  for (const key in tree) {
    const fullPath = path ? `${path}/${key}` : key;
    const value = tree[key];

    if (typeof value === 'string') {
      const file = document.createElement("div");
      file.className = "ml-4 cursor-pointer hover:text-blue-600";
      file.textContent = key;
      file.onclick = () => {
        document.getElementById("activeFilename").textContent = fullPath;
        document.getElementById("codeViewer").textContent = value;
      };
      fragment.appendChild(file);
    } else {
      const folder = document.createElement("div");
      folder.className = "ml-2 mb-1";

      const toggle = document.createElement("div");
      toggle.textContent = key;
      toggle.className = "folder-toggle cursor-pointer font-semibold text-gray-700";
      toggle.onclick = () => {
        toggle.classList.toggle('open');
        content.classList.toggle('hidden');
      };

      const content = document.createElement("div");
      content.className = "ml-4 hidden";
      content.appendChild(renderTreeNodes(value, fullPath));

      folder.appendChild(toggle);
      folder.appendChild(content);
      fragment.appendChild(folder);
    }
  }

  return fragment;
}
