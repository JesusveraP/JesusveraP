import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom', '@inertiajs/react'],
                }
            }
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
        }
    }
});
