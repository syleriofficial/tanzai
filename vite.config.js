import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "tanzaiai.com",
      "www.tanzaiai.com",
      "tanzai-ai-1090196601955.us-central1.run.app",
      ".run.app"
    ]
  }
});
