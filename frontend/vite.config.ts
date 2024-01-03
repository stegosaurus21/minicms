import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: "../backend/public",
    emptyOutDir: true,
    sourcemap: true,
  },
});
