import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "es6",
    outDir: "dist",
  },
  root: path.resolve("frontend"),
});
