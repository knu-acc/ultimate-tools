const fs = require('fs');
let css = fs.readFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/globals.css', 'utf8');

// Fix About section
css = css.replace(
  /\/\* About tool collapsible \*\/[\s\S]*?\.tool-about-section \.tool-about-content \{[\s\S]*?\}/,
  `/* About section */
.tool-about-section summary {
  cursor: pointer; list-style: none;
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; color: var(--text);
  padding: 14px 18px;
  border-radius: var(--radius); border: 1px solid var(--border);
  background: var(--surface); transition: all 0.15s; user-select: none;
}
.tool-about-section summary:hover { border-color: var(--accent); background: var(--accent-bg); }
.tool-about-section summary::-webkit-details-marker { display: none; }
.tool-about-section summary::before {
  content: '\u203a'; font-size: 18px; color: var(--text-faint);
  transition: transform 0.2s; display: inline-block;
}
.tool-about-section[open] summary::before { transform: rotate(90deg); }
.tool-about-section .tool-about-content {
  margin-top: 8px; padding: 18px;
  border-radius: var(--radius); border: 1px solid var(--border);
  background: var(--surface); color: var(--text-muted);
  font-size: 14px; line-height: 1.7;
}`
);

// Fix Empty State
css = css.replace(
  /\/\* Empty State \*\/[\s\S]*?\.empty-state \{[\s\S]*?\}/,
  `/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  border-radius: var(--radius); border: 1px dashed var(--border);
  background: var(--bg-subtle); padding: 32px 20px;
  text-align: center; color: var(--text-muted); font-size: 14px;
}`
);

// Fix stat card
css = css.replace(
  /\/\* Stat card for numbers \*\/[\s\S]*?\.stat-card \.stat-label \{[\s\S]*?\}/,
  `/* Stat cards */
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px; text-align: center;
  transition: border-color 0.15s;
}
.stat-card:hover { border-color: var(--accent); }
.stat-card .stat-value {
  font-size: 28px; font-weight: 800; color: var(--accent);
  letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1;
}
.stat-card .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }`
);

// Fix section/field labels
css = css.replace(
  /\/\* Section heading in tools \*\/[\s\S]*?\.field-label \{[\s\S]*?\}/,
  `/* Labels */
.section-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.field-label   { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }`
);

// Fix badge
css = css.replace(
  /\/\* Status badges \*\/[\s\S]*?\.badge-danger \{[\s\S]*?\}/,
  `/* Badges */
.badge-success { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 10px; border-radius: 100px; font-size: 12px; font-weight: 600; background: var(--success-bg); color: var(--success); }
.badge-danger  { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 10px; border-radius: 100px; font-size: 12px; font-weight: 600; background: var(--danger-bg);  color: var(--danger); }`
);

// Fix toggle
css = css.replace(
  /\/\* Toggle switch \*\/[\s\S]*?\.toggle-switch\.active::after \{[\s\S]*?\}/,
  `.toggle-switch {
  position: relative; width: 42px; height: 24px;
  border-radius: 12px; background: var(--border-strong);
  cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.toggle-switch.active { background: var(--accent); }
.toggle-switch::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 0.2s;
}
.toggle-switch.active::after { transform: translateX(18px); }`
);

// Fix scrollbar
css = css.replace(
  /\/\* Custom Scrollbar \*\/[\s\S]*?::-webkit-scrollbar-thumb:hover \{[\s\S]*?\}/,
  `::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }`
);

// Remove the shimmer-only keyframes block and replace with also fadeIn
css = css.replace(
  /@keyframes shimmer \{[\s\S]*?\}/,
  `/* Scrollbar utils */
.hidden-scrollbar::-webkit-scrollbar { display: none; }
.hidden-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes shimmer { 100% { transform: translateX(100%); } }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`
);

fs.writeFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/globals.css', css, 'utf8');
console.log('All sections fixed. Final size:', css.length);
