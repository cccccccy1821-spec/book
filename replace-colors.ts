import fs from 'fs';
import path from 'path';

const colors = {
  '#5c4033': 'var(--theme-primary)',
  '#8b6b5d': 'var(--theme-secondary)',
  '#c27ba0': 'var(--theme-accent)',
  '#a66285': 'var(--theme-accent-hover)',
  '#e8b4b8': 'var(--theme-accent-light)',
  '#f4ece6': 'var(--theme-bg-subtle)',
  '#e8dcc4': 'var(--theme-border)',
  '#8b5a2b': 'var(--theme-camera-text)',
};

function walk(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const [hex, cssVar] of Object.entries(colors)) {
        if (content.includes(hex)) {
          content = content.split(hex).join(cssVar);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

walk('./src');
