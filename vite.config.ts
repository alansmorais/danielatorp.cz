import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function serveImagesPlugin(): Plugin {
  return {
    name: 'serve-images-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/images/') || req.url.startsWith('images/'))) {
          const cleanUrl = req.url.replace(/^\/?images\//, '');
          const decoded = decodeURIComponent(cleanUrl);
          const filePath = path.resolve(__dirname, 'images', decoded);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.svg': 'image/svg+xml',
              '.webp': 'image/webp',
              '.ico': 'image/x-icon'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'images');
      const destDir = path.resolve(__dirname, 'dist', 'images');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), serveImagesPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
