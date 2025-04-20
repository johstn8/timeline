// frontend/vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    envDir: '../config',

    plugins: [
        react(),
        tailwindcss({
            config: './tailwind.config.cjs',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:4000',
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
