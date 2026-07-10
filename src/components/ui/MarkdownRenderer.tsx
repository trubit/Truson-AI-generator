import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple regex-based high-performance markdown parser
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const blocks: React.ReactNode[] = [];
    const lines = text.split('\n');

    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];
    let listItems: React.ReactNode[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        blocks.push(
          <ul key={`list-${key}`} className="my-2 ps-4 text-light">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = (key: number) => {
      if (inTable) {
        blocks.push(
          <div key={`table-wrapper-${key}`} className="table-responsive my-3">
            <table className="table table-dark table-bordered table-striped border-secondary mb-0 small align-middle">
              {tableHeaders.length > 0 && (
                <thead>
                  <tr>
                    {tableHeaders.map((h, i) => (
                      <th key={`th-${i}`} className="bg-dark text-cyan py-2">{h.trim()}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows.map((row, rowIndex) => (
                  <tr key={`tr-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${cellIndex}`} className="py-2">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          const finalCode = codeContent.join('\n');
          blocks.push(
            <div key={`code-${idx}`} className="position-relative my-3 rounded-3 overflow-hidden border border-secondary bg-dark bg-opacity-80">
              <div className="d-flex align-items-center justify-content-between px-3 py-1.5 bg-black bg-opacity-40 border-bottom border-secondary text-secondary small">
                <span className="fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>{codeLanguage || 'code'}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-secondary hover-text-white p-0 text-decoration-none"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    navigator.clipboard.writeText(finalCode);
                  }}
                >
                  Copy
                </button>
              </div>
              <pre className="p-3 m-0 overflow-auto text-mono text-cyan" style={{ fontSize: '0.82rem', maxHeight: '400px' }}>
                <code>{finalCode}</code>
              </pre>
            </div>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          // Open code block
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Tables
      if (line.startsWith('|')) {
        flushList(idx);
        const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (line.includes('---')) {
          // Separator row, skip
          continue;
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else {
        flushTable(idx);
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        listItems.push(
          <li key={`li-${idx}`} className="mb-1 text-light">
            {line.substring(2)}
          </li>
        );
        continue;
      } else {
        flushList(idx);
      }

      // Headers
      if (line.startsWith('# ')) {
        blocks.push(<h2 key={`h2-${idx}`} className="fw-bold mb-3 mt-4 text-light text-gradient" style={{ fontFamily: 'Outfit' }}>{line.slice(2)}</h2>);
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push(<h3 key={`h3-${idx}`} className="fw-bold mb-3 mt-4 text-light" style={{ fontFamily: 'Outfit' }}>{line.slice(3)}</h3>);
        continue;
      }
      if (line.startsWith('### ')) {
        blocks.push(<h4 key={`h4-${idx}`} className="fw-semibold mb-2 mt-3 text-light-50" style={{ fontFamily: 'Outfit' }}>{line.slice(4)}</h4>);
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        blocks.push(
          <blockquote key={`bq-${idx}`} className="border-start border-purple border-3 ps-3 text-secondary my-3 italic">
            {line.slice(2)}
          </blockquote>
        );
        continue;
      }

      // Default paragraphs
      if (line.trim() !== '') {
        // Parse bold **text** and inline `code`
        let parsedLine: React.ReactNode = line;
        
        // Match bold
        if (line.includes('**')) {
          const parts = line.split('**');
          parsedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part);
        }

        blocks.push(
          <p key={`p-${idx}`} className="mb-2 text-light" style={{ lineHeight: '1.6' }}>
            {parsedLine}
          </p>
        );
      } else {
        blocks.push(<div key={`space-${idx}`} className="mb-2" />);
      }
    }

    // Flush remaining blocks
    flushList(lines.length);
    flushTable(lines.length);

    return blocks;
  };

  return <div className="markdown-body text-light">{renderFormattedText(content)}</div>;
};
