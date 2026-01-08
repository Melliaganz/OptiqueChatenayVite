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
  enforce: "post",
  transformIndexHtml(html) {
    // On extrait uniquement ce qui est dans le HEAD pour ne pas polluer le BODY
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    if (!headMatch) return html;

    let headContent = headMatch[1];
    
    // 1. Extraire preloads et scripts
    const preloads = headContent.match(/<link rel="modulepreload"[^>]*>/g) || [];
    const scripts = headContent.match(/<script type="module"[^>]*><\/script>/g) || [];
    
    // 2. Nettoyer le head de ces doublons
    headContent = headContent
      .replace(/<link rel="modulepreload"[^>]*>/g, "")
      .replace(/<script type="module"[^>]*><\/script>/g, "");
    
    // 3. Re-insérer proprement à la fin du head
    const optimizedBlock = [
      "\n    ",
      ...preloads,
      "    ",
      ...scripts,
      ""
    ].join("\n    ");

    return html.replace(/<head>[\s\S]*?<\/head>/, `<head>${headContent}${optimizedBlock}</head>`);
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
