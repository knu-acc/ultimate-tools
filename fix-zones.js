const fs = require('fs');
let css = fs.readFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/globals.css', 'utf8');

const zoneStart = css.indexOf('/* \u2500\u2500 Tool Zone Layout \u2500\u2500 */');
const aboutStart = css.indexOf('/* About tool collapsible */');

const newZone = `/* === TOOL ZONES === */
.tool-input-zone {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.tool-output-zone {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--success);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.tool-zone-header {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 14px; user-select: none;
}
.tool-input-zone  .tool-zone-header { color: var(--accent); }
.tool-output-zone .tool-zone-header { color: var(--success); }
.tool-zone-icon { font-size: 14px; line-height: 1; }
.tool-action-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 4px 0; }
.tool-hero-input {
  width: 100%; border-radius: var(--radius-lg); border: 2px solid var(--border);
  background: var(--surface); padding: 14px 18px;
  font-size: 22px; font-weight: 600;
  transition: border-color 0.15s, box-shadow 0.15s; outline: none; color: var(--text);
}
.tool-hero-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }
.tool-hero-input::placeholder { color: var(--text-faint); font-weight: 400; }
.secure-output {
  background: #0F1117; color: #E2E8F0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 14px; line-height: 1.6;
  border-radius: var(--radius); padding: 14px 16px; word-break: break-all;
}
.dark .secure-output { background: #070B12; }
.tool-split-pane { display: flex; flex-direction: column; gap: 16px; }
@media (min-width: 1024px) { .tool-split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; } }

`;

css = css.substring(0, zoneStart) + newZone + css.substring(aboutStart);
fs.writeFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/globals.css', css, 'utf8');
console.log('Done. size:', css.length);
