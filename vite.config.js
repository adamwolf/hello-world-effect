import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["hello-world-effect.js"],
      name: "HelloWorldEffect",
      fileName: (format) => `hello-world-effect.${format}.js`,
    },
    rollupOptions: {
      external: [
        'three',
        'postprocessing',
        '@google/model-viewer',
        '@google/model-viewer-effects'
      ],

    },
    sourcemap: true,
    minify: true,
    output: {
      globals: {
        three: "THREE"
      },
    },
  },
  server: {
    assetsInclude: ["**/*.glb"],
  },
});
