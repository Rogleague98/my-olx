import { defineConfig } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});