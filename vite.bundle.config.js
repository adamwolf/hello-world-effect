import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["bundle.js"],
      name: "HelloWorldEffect",
      fileName: (format) => `hello-world-effect.bundle.${format}.js`,
    },
    sourcemap: true,
    minify: true,
    outDir: 'bundle-dist',
  },
  server: {
    assetsInclude: ["**/*.glb"],
  },
});
