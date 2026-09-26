import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function serveRootAudio(): Plugin {
  return {
    name: 'serve-root-audio',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.endsWith('.mp3') || req.url.endsWith('.wav') || req.url.endsWith('.ogg'))) {
          const cleanUrl = req.url.split('?')[0].replace(/^\//, '');
          const rootFilePath = path.resolve(__dirname, cleanUrl);
          const publicFilePath = path.resolve(__dirname, 'public', cleanUrl);

          let targetFile: string | null = null;
          if (fs.existsSync(rootFilePath) && fs.statSync(rootFilePath).isFile()) {
            targetFile = rootFilePath;
          } else if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
            targetFile = publicFilePath;
          }

          if (targetFile) {
            const ext = path.extname(targetFile).toLowerCase();
            const mimeType = ext === '.wav' ? 'audio/wav' : ext === '.ogg' ? 'audio/ogg' : 'audio/mpeg';
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Accept-Ranges', 'bytes');
            fs.createReadStream(targetFile).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveRootAudio()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
