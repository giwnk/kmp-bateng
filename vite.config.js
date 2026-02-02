import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: "127.0.0.1", // Paksa pakai IP angka, jangan localhost
        port: 5173, // Port default Vite
        hmr: {
            host: "127.0.0.1", // Paksa WebSocket lewat jalur ini juga
        },
    },
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
});
