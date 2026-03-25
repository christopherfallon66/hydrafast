import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Plugin to stamp the service worker with a build timestamp
function swVersionPlugin() {
  return {
    name: 'sw-version',
    writeBundle() {
      const swPath = resolve('dist', 'sw.js');
      try {
        let sw = readFileSync(swPath, 'utf-8');
        sw = sw.replace('__BUILD_TIMESTAMP__', Date.now().toString(36));
        writeFileSync(swPath, sw);
      } catch {
        // sw.js may not exist in dev
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), swVersionPlugin()],
})
