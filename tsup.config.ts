import { defineConfig } from "tsup";

export default defineConfig({
  entry: { "bin/index": "src/bin/index.ts" },
  format: ["esm"],
  target: "node18",
  clean: true,
  splitting: false,
  sourcemap: false,
  shims: true,
});
