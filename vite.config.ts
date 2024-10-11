import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["vite.svg"],
  manifest: {
    name: "RAKA POS APP",
    short_name: "RAKA POS",
    description: "A POS app for RAKA",
    icons: [
      {
        src: "/vite.svg", // Path to your new icon for 192x192
        sizes: "192x192",
        type: "image/svg+xml", // Change the type to svg
        purpose: "any maskable",
      },
      {
        src: "/vite.svg", // Path to your new icon for 384x384
        sizes: "384x384",
        type: "image/svg+xml", // Change the type to svg
      },
      {
        src: "/vite.svg", // Path to your new icon for 512x512
        sizes: "512x512",
        type: "image/svg+xml", // Change the type to svg
      },
    ],
    theme_color: "#181818",
    background_color: "#e0cc3b",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
