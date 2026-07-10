export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h5 class="fw-bold mt-3 text-white">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="fw-bold mt-4 text-white">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="fw-bold mt-4 text-white">$1</h3>');

  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Bullet Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<ul class="mb-2"><li class="text-secondary">$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Paragraph blocks (split by double newlines)
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<ul')) {
      return p;
    }
    return `<p class="text-secondary lh-lg mb-3">${p.replace(/\n/g, '<br />')}</p>`;
  }).join('');

  return html;
};
