/**
 * Lightweight markdown → HTML renderer for Axesntra article pages.
 * Handles: h2/h3, paragraphs, ordered/unordered lists (with nested sub-items),
 * checkbox lists, tables, hr, bold, italic, inline code.
 */

export function mdToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (line.startsWith('### ')) {
      html += `<h3>${applyInline(line.slice(4))}</h3>`;
      i++; continue;
    }
    if (line.startsWith('## ')) {
      html += `<h2>${applyInline(line.slice(3))}</h2>`;
      i++; continue;
    }
    if (line.startsWith('# ')) {
      i++; continue; // skip h1 — headline is rendered separately
    }
    if (line.trim() === '---') {
      html += '<hr />';
      i++; continue;
    }
    // Table
    if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i]);
        i++;
      }
      html += renderTable(rows);
      continue;
    }
    // Unordered list (including checkbox items, indented sub-items)
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].match(/^[-*] /) || lines[i].match(/^  [-*] /))) {
        items.push(lines[i]);
        i++;
      }
      html += renderUL(items);
      continue;
    }
    // Ordered list (may include "   - " sub-items)
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].match(/^\d+\. /) || lines[i].match(/^   [-*] /))) {
        items.push(lines[i]);
        i++;
      }
      html += renderOL(items);
      continue;
    }
    // Paragraph — collect until a block boundary
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('|') &&
      !lines[i].match(/^[-*] /) &&
      !lines[i].match(/^\d+\. /) &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      html += `<p>${applyInline(paraLines.join(' '))}</p>`;
    }
  }

  return html;
}

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderTable(rows: string[]): string {
  // Filter out separator rows like |---|---|
  const nonSep = rows.filter(r => !r.replace(/\|/g, '').trim().match(/^[-: ]+$/));
  if (nonSep.length < 2) return '';
  const [header, ...body] = nonSep;

  const parseCells = (row: string) =>
    row.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

  const heads = parseCells(header).map(h => `<th>${applyInline(h)}</th>`).join('');
  const bodyRows = body
    .map(r => {
      const cells = parseCells(r).map(c => `<td>${applyInline(c)}</td>`).join('');
      return cells ? `<tr>${cells}</tr>` : '';
    })
    .filter(Boolean)
    .join('');

  return `<table><thead><tr>${heads}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function renderUL(items: string[]): string {
  const liHtml = items.map(item => {
    const raw = item.replace(/^[-*] /, '').replace(/^  [-*] /, '');
    if (raw.startsWith('[ ] ')) {
      return `<li class="check-item"><span class="check-box">☐</span> ${applyInline(raw.slice(4))}</li>`;
    }
    if (raw.startsWith('[x] ') || raw.startsWith('[X] ')) {
      return `<li class="check-item"><span class="check-box">☑</span> ${applyInline(raw.slice(4))}</li>`;
    }
    return `<li>${applyInline(raw)}</li>`;
  }).join('');
  return `<ul>${liHtml}</ul>`;
}

function renderOL(items: string[]): string {
  let result = '<ol>';
  let i = 0;
  while (i < items.length) {
    const line = items[i];
    if (line.match(/^\d+\. /)) {
      const content = applyInline(line.replace(/^\d+\. /, ''));
      const subs: string[] = [];
      while (i + 1 < items.length && items[i + 1].match(/^   [-*] /)) {
        subs.push(items[i + 1].replace(/^   [-*] /, ''));
        i++;
      }
      if (subs.length > 0) {
        const subHtml = '<ul>' + subs.map(s => `<li>${applyInline(s)}</li>`).join('') + '</ul>';
        result += `<li>${content}${subHtml}</li>`;
      } else {
        result += `<li>${content}</li>`;
      }
    }
    i++;
  }
  result += '</ol>';
  return result;
}
