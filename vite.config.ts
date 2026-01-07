import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,
      webp: { quality: 50 },
      avif: { quality: 45 },
    }),
    // Ce plugin garantit que Lighthouse ne verra aucune dépendance en cascade
    {
      name: "force-preload-order",
      enforce: "post", // S'exécute après que tous les autres plugins ont fini
      transformIndexHtml(html) {
        // 1. Extraire tous les preloads et les scripts modules
        const preloads = html.match(/<link rel="modulepreload"[^>]*>/g) || [];
        const scripts = html.match(/<script type="module"[^>]*><\/script>/g) || [];
        
        // 2. Supprimer les anciens emplacements
        let cleanHtml = html
          .replace(/<link rel="modulepreload"[^>]*>/g, "")
          .replace(/<script type="module"[^>]*><\/script>/g, "");
        
        // 3. Réorganiser : Les preloads (engine, etc.) TOUJOURS avant les scripts
        const optimizedBlock = [
          "",
          ...preloads,
          "",
          ...scripts
        ].join("\n    ");

        return cleanHtml.replace("</head>", `  ${optimizedBlock}\n  </head>`);
      }
    }
  ],
  build: {
    target: "esnext",
    minify: "terser",
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/preact') || id.includes('node_modules/react-router')) {
            return 'engine';
          }
          if (id.includes('firebase')) return 'v-fb';
        },
      },
    },
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
});
