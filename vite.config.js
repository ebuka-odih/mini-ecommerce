import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        {
            name: 'remove-use-client',
            transform(code, id) {
                if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/@headlessui')) {
                    return code.replace(/"use client";?\s*/g, '');
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@/components': resolve(__dirname, 'resources/js/components'),
            '@/pages': resolve(__dirname, 'resources/js/pages'),
            '@/hooks': resolve(__dirname, 'resources/js/hooks'),
            '@/utils': resolve(__dirname, 'resources/js/utils'),
            '@/types': resolve(__dirname, 'resources/js/types'),
            '@/services': resolve(__dirname, 'resources/js/services'),
            '@/layouts': resolve(__dirname, 'resources/js/layouts'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    inertia: ['@inertiajs/react'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-navigation-menu', '@radix-ui/react-collapsible', '@radix-ui/react-dismissable-layer', '@radix-ui/react-focus-guards', '@radix-ui/react-focus-scope', '@radix-ui/react-presence', '@radix-ui/react-portal', '@radix-ui/react-popper', '@radix-ui/react-collection', '@radix-ui/react-menu', '@radix-ui/react-roving-focus'],
                    headlessui: ['@headlessui/react'],
                    icons: ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 2000,
    },
});



