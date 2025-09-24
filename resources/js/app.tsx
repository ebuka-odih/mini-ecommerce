import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './components/ui/toast';
import { CartProvider } from './contexts/cart-context';

const appName = import.meta.env.VITE_APP_NAME || 'GNOSIS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.{jsx,tsx}', { eager: true });
        const normalizedName = name.replace(/\./g, '/');
        
        // Try different extensions
        for (const ext of ['.tsx', '.jsx']) {
            const path = `./pages/${normalizedName}${ext}`;
            if (pages[path]) {
                return (pages[path] as any).default;
            }
        }
        
        throw new Error(`Page not found: ${name} (available: ${Object.keys(pages).join(', ')})`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <CartProvider>
                    <App {...props} />
                </CartProvider>
            </ToastProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
