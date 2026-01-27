import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mdx from "@mdx-js/rollup";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        jsxImportSource: "vue",
        providerImportSource: "@mdx-js/vue",
      }),
    },
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/styles/variables.scss";`
      },
    },
  },
});
