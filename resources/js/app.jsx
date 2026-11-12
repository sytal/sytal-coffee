import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';


createInertiaApp({
    // One brand everywhere: page titles already start with "Crunches Cafe —"
    // where relevant, so only add the cafe name when it's missing.
    title: (title) => (!title ? 'Crunches Cafe' : title.includes('Crunches Cafe') ? title : `${title} · Crunches Cafe`),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
