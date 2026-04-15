/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// GitHub Pages 배포용 base 경로. 리포 이름이 다르면 환경 변수로 주입하거나 수정.
const base = process.env.VITE_BASE ?? "/pre_married/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
