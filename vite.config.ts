import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * TEACHING NOTE — what “proxy” means here
 *
 * In live mode the React app only talks to `/api/propertysearch` on the same dev origin.
 * This file tells Vite: “when you see that path, forward the request to PROPERTY_SEARCH_PROXY_TARGET
 * and rewrite the path to PROPERTY_SEARCH_PROXY_PATH.”
 *
 * So: browser → your laptop’s dev server → real API host. CORS is often easier because the browser
 * thinks it’s talking to localhost.
 *
 * Variables live in `.env.local` (see `.env.example`). Use PROPERTY_SEARCH_* (not VITE_*) so the
 * secret base URL is not baked into client JavaScript.
 *
 * Optional: `/api/autocomplete` for experiments in lib/service/autocompleteService.ts.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const propertySearchTarget = env.PROPERTY_SEARCH_PROXY_TARGET?.trim();
  const propertySearchPath = env.PROPERTY_SEARCH_PROXY_PATH?.trim() || '/functions/v1/xlab-propertysearch';
  const autocompleteTarget = env.ZILLOW_AUTOCOMPLETE_PROXY_TARGET?.trim() || 'https://www.zillowstatic.com';

  const proxy: Record<string, object> = {};

  if (propertySearchTarget) {
    proxy['/api/propertysearch'] = {
      target: propertySearchTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/propertysearch/, propertySearchPath),
      configure: (proxyServer) => {
        proxyServer.on('proxyReq', (proxyReq) => {
          // Some upstreams reject requests unless Referer/Origin look like Zillow (existing project behavior).
          proxyReq.setHeader('origin', 'https://www.zillow.com');
          proxyReq.setHeader('referer', 'https://www.zillow.com/');
          proxyReq.removeHeader('x-forwarded-for');
          proxyReq.removeHeader('x-forwarded-host');
          proxyReq.removeHeader('x-forwarded-proto');
        });
      },
    };
  }

  proxy['/api/autocomplete'] = {
    target: autocompleteTarget,
    changeOrigin: true,
    rewrite: (path: string) =>
      path.replace(/^\/api\/autocomplete/, '/autocomplete/v3/suggestions'),
  };

  return {
    base: mode === 'production' ? '/mover-zretreat-demo/' : '/',
    plugins: [react()],
    server: { port: 3000, proxy },
  };
});
