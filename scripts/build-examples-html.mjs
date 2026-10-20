#!/usr/bin/env node
// EXAMPLES.md → interactive HTML 페이지
//
// 컴포넌트 사용 예제 문서를 copy-paste 친화 페이지로 변환:
// - 마크다운 변환(headings, paragraphs, lists, tables, code blocks, inline code, links)
// - 각 code block에 "Copy code" 버튼 + 시각 토큰 스타일링
// - exports/tokens.css 내장 — 미리보기 토큰값 색상으로 표시
// - external dependency 0 — vanilla Node + regex
//
// 사용법:
//   node scripts/build-examples-html.mjs > exports/examples.html

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { stdout } from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function escape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(text) {
  // inline code, bold, links — order matters
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escape(c)}</code>`);
  // images / links 처리는 단순 [text](url) 만
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${escape(u)}">${t}</a>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return text;
}

// 매우 단순한 markdown 변환기 — EXAMPLES.md 구조에 한정
function mdToHtml(md) {
  const lines = md.split("\n");
  let out = [];
  let i = 0;
  let codeBuf = null;
  let codeLang = "";
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const [headerRaw, sepRaw, ...rest] = tableRows;
    const headers = headerRaw.split("|").slice(1, -1).map(s => s.trim());
    out.push('<div class="table-wrap"><table>');
    out.push("<thead><tr>" + headers.map(h => `<th>${inline(h)}</th>`).join("") + "</tr></thead>");
    out.push("<tbody>");
    for (const row of rest) {
      const cells = row.split("|").slice(1, -1).map(s => s.trim());
      out.push("<tr>" + cells.map(c => `<td>${inline(c)}</td>`).join("") + "</tr>");
    }
    out.push("</tbody></table></div>");
    tableRows = [];
    inTable = false;
  }

  while (i < lines.length) {
    const line = lines[i];
    // code block fence
    if (line.startsWith("```")) {
      if (codeBuf === null) {
        if (inTable) flushTable();
        codeLang = line.slice(3).trim() || "html";
        codeBuf = [];
      } else {
        const escaped = escape(codeBuf.join("\n"));
        out.push(`<div class="code-wrap"><div class="code-toolbar"><span class="code-lang">${escape(codeLang)}</span><button class="code-copy" type="button">Copy</button></div><pre><code class="lang-${escape(codeLang)}">${escaped}</code></pre></div>`);
        codeBuf = null;
        codeLang = "";
      }
      i++;
      continue;
    }
    if (codeBuf !== null) {
      codeBuf.push(line);
      i++;
      continue;
    }
    // table
    if (line.startsWith("|") && line.endsWith("|")) {
      tableRows.push(line);
      inTable = true;
      i++;
      continue;
    }
    if (inTable && line.trim() === "") {
      flushTable();
      i++;
      continue;
    }
    // headings
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      if (inTable) flushTable();
      const level = h[1].length;
      const slug = h[2].toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-");
      out.push(`<h${level} id="${slug}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    // hr
    if (line.startsWith("---") && line.replace(/-/g, "").trim() === "") {
      if (inTable) flushTable();
      out.push("<hr>");
      i++;
      continue;
    }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      if (inTable) flushTable();
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      out.push("<ul>" + items.map(it => `<li>${inline(it)}</li>`).join("") + "</ul>");
      continue;
    }
    // ordered list
    if (/^\d+\.\s/.test(line)) {
      if (inTable) flushTable();
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      out.push("<ol>" + items.map(it => `<li>${inline(it)}</li>`).join("") + "</ol>");
      continue;
    }
    // empty line
    if (line.trim() === "") {
      if (inTable) flushTable();
      i++;
      continue;
    }
    // paragraph
    if (inTable) flushTable();
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("```") && !lines[i].startsWith("|") && !/^#{1,4}\s/.test(lines[i]) && !/^[-*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  if (inTable) flushTable();
  return out.join("\n");
}

const md = readFileSync(resolve(ROOT, "EXAMPLES.md"), "utf8");
const tokensCss = readFileSync(resolve(ROOT, "exports/tokens.css"), "utf8");
const body = mdToHtml(md);

const pageCss = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  margin: 0;
  padding: 0;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  letter-spacing: var(--text-body--letter-spacing);
}
[data-theme="dark"] body {
  background: var(--color-bg-page-dark);
  color: var(--color-text-primary-dark);
}
[data-theme="dark"] {
  --color-bg-page: var(--color-bg-page-dark);
  --color-surface-default: var(--color-surface-default-dark);
  --color-surface-input: var(--color-surface-input-dark);
  --color-text-primary: var(--color-text-primary-dark);
  --color-text-secondary: var(--color-text-secondary-dark);
  --color-text-tertiary: var(--color-text-tertiary-dark);
  --color-border-default: var(--color-border-default-dark);
}
main {
  max-width: 880px;
  margin: 0 auto;
  padding: 56px 32px 96px;
}
h1, h2, h3, h4 {
  font-family: var(--font-sans);
  margin-top: 56px;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
h1 { font-size: var(--text-heading-xl); font-weight: 700; margin-top: 0; line-height: 1.2; }
h2 { font-size: var(--text-heading-lg); font-weight: 700; padding-bottom: 12px; border-bottom: 1px solid var(--color-border-default); }
h3 { font-size: var(--text-heading-md); font-weight: 600; margin-top: 32px; }
h4 { font-size: var(--text-heading-sm); font-weight: 600; margin-top: 24px; color: var(--color-text-secondary); }
p { margin: 12px 0; color: var(--color-text-primary); }
a { color: var(--color-primary, var(--color-info)); text-decoration: none; }
a:hover { text-decoration: underline; }
strong { font-weight: 600; color: var(--color-text-primary); }
ul, ol { margin: 12px 0; padding-left: 24px; }
li { margin: 4px 0; }
hr { border: 0; border-top: 1px solid var(--color-border-default); margin: 48px 0; }
code {
  background: var(--color-surface-input);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 0.9em;
  color: var(--color-text-primary);
}
pre { margin: 0; }
pre code {
  display: block;
  padding: 16px 20px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  overflow-x: auto;
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-top: 0;
  white-space: pre;
  font-size: 13px;
  line-height: 1.6;
}
.code-wrap {
  margin: 16px 0 24px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
}
.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--color-surface-input);
  border-bottom: 1px solid var(--color-border-default);
}
.code-lang {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.code-copy {
  background: transparent;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 4px 12px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--motion-duration-fast) var(--motion-ease-out);
}
.code-copy:hover { color: var(--color-text-primary); border-color: var(--color-text-secondary); }
.code-copy.copied { color: var(--color-success); border-color: var(--color-success); }
.code-wrap pre code {
  border: 0;
  border-radius: 0;
  border-top: 0;
}
.table-wrap {
  margin: 16px 0;
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-caption);
}
thead { background: var(--color-surface-input); }
th { text-align: left; padding: 10px 12px; font-weight: 600; color: var(--color-text-secondary); border-bottom: 1px solid var(--color-border-default); }
td { padding: 10px 12px; border-bottom: 1px solid var(--color-border-default); }
tbody tr:last-child td { border-bottom: 0; }

.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-primary);
  z-index: 100;
}
[data-theme="dark"] .theme-toggle { background: var(--color-surface-default-dark); border-color: var(--color-border-default-dark); color: var(--color-text-primary-dark); }
[data-theme="dark"] code { background: var(--color-surface-input-dark); color: var(--color-text-primary-dark); }
[data-theme="dark"] pre code { background: var(--color-surface-default-dark); border-color: var(--color-border-default-dark); }
[data-theme="dark"] .code-wrap { background: var(--color-surface-default-dark); border-color: var(--color-border-default-dark); }
[data-theme="dark"] .code-toolbar { background: var(--color-surface-input-dark); border-color: var(--color-border-default-dark); }
[data-theme="dark"] .table-wrap { border-color: var(--color-border-default-dark); }
[data-theme="dark"] thead { background: var(--color-surface-input-dark); }
[data-theme="dark"] th, [data-theme="dark"] td { border-color: var(--color-border-default-dark); }

@media (max-width: 720px) {
  main { padding: 32px 16px 64px; }
  h1 { font-size: var(--text-heading-lg); }
  h2 { font-size: var(--text-heading-md); }
}
`;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Groo Design — Component Examples</title>
  <script>
    (function() {
      try {
        var saved = localStorage.getItem("groo-theme");
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = saved || (prefersDark ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", theme);
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "light");
      }
    })();
  </script>
  <style>${tokensCss}</style>
  <style>${pageCss}</style>
</head>
<body>
  <button class="theme-toggle" type="button" aria-label="테마 전환" onclick="(function(){var c=document.documentElement.getAttribute('data-theme');var n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('groo-theme',n)}catch(e){}})()">🌓 Theme</button>
  <main>
${body}
  </main>
  <script>
    document.querySelectorAll(".code-copy").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var pre = btn.closest(".code-wrap").querySelector("pre code");
        if (!pre) return;
        var text = pre.textContent;
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(function() {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 1600);
        }).catch(function() {
          btn.textContent = "Failed";
        });
      });
    });
  </script>
</body>
</html>
`;

stdout.write(html);
