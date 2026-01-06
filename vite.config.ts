import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    visualizer({
      open: false,
      filename: "stats.html",
      gzipSize: true,
    }),
  ],
  build: {
    // 1. Désactive explicitement le polyfill qui génère le JS inutilisé
    modulePreload: {
      polyfill: false,
    },
    // 2. Optimisation du rendu
    minify: "esbuild",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
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
