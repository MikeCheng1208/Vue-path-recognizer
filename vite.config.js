import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL(".", import.meta.url)), "src/index.js"),
      name: "VuePathRecognizer",
      fileName: (format) => `vue-path-recognizer.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
