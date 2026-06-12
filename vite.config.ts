import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    preact(),
    cssInjectedByJsPlugin(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,
      webp: { quality: 50 },
      avif: { quality: 45 },
    }),
  ],
  build: {
    target: "esnext",
    minify: "terser",
    modulePreload: {
      polyfill: false,
    },
  },
});
