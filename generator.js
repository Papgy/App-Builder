function extractCodeBlocks(text) {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let blocks = [], match;
  while ((match = regex.exec(text)) !== null) {
    const lang = match[1] || "txt";
    blocks.push({ filename: `file.${lang}`, content: match[2], lang });
  }
  return blocks;
}
