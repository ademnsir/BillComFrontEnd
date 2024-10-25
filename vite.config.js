import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  scss: {
    additionalData: `@import "./src/widgets/assets/animation.scss";`,
  },
});
