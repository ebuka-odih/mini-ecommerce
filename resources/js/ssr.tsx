import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || '';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => {
            // If no app name, return title as is
            if (!appName) {
                return title;
            }
            // If title already includes app name, return as is
            if (title.includes(` - ${appName}`) || title.endsWith(` - ${appName}`)) {
                return title;
            }
            // Add app name suffix to all titles
            return `${title} - ${appName}`;
        },
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