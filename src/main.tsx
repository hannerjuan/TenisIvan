import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CatalogProvider } from './context/CatalogContext';
import './index.css';

// Swap any product photo that fails to load (expired CDN link, offline) for a neutral
// placeholder instead of the browser's broken-image icon with alt text spilling out.
const IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><path d="M170 215h60l10 15h25v75h-130v-75h25z" fill="none" stroke="#17131f" stroke-opacity="0.25" stroke-width="8" stroke-linejoin="round"/><circle cx="200" cy="268" r="20" fill="none" stroke="#17131f" stroke-opacity="0.25" stroke-width="8"/></svg>'
  );

document.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.src !== IMAGE_FALLBACK) {
      img.src = IMAGE_FALLBACK;
    }
  },
  true
);

createRoot(document.getElementById('root')!).render(
  <CatalogProvider>
    <App />
  </CatalogProvider>
);
