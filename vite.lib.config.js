import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/gpu-app.ts"),
      name: "gpu-app",
      fileName: (format) => `gpu-app.${format}.js`,
    },
  },
});
