import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'GNOSIS';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
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
        setup: ({ App, props }) => <App {...props} />,
    }),
);