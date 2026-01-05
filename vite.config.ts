import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    visualizer({
      open: false,
      filename: "stats.html",
      gzipSize: true,
    }),
    viteSingleFile({
      removeViteModuleLoader: true,
    }),

    {
      name: "inline-css",
      apply: "build",
      transformIndexHtml(html, { bundle }) {
        if (!bundle) return html;
        let newHtml = html;
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (fileName.endsWith(".css") && "source" in asset) {
            const styleTag = `<style>${asset.source}</style>`;
            newHtml = newHtml.replace(
              new RegExp(`<link[^>]*href="[^"]*${fileName}"[^>]*>`, "g"),
              styleTag
            );
          }
        }

        return newHtml;
      },
    },
  ],

  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name &&
            (assetInfo.name.includes("hero_") ||
              assetInfo.name.includes("image_2026-01-03"))
          ) {
            return "assets/[name].[ext]";
          }
          const info = assetInfo.name?.split(".");
          const ext = info?.[info.length - 1];
          if (ext === "css") return "assets/css/[name]-[hash].[ext]";
          return "assets/[ext]/[name]-[hash].[ext]";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@vercel/speed-insights/next": "@vercel/speed-insights/react",
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
});
