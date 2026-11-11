import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { jocaApi } from "./server/vite-plugin";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command }) => ({
  resolve: {
    alias:
      command === "build"
        ? [
            {
              find: "./chat-runtime",
              replacement: fileURLToPath(
                new URL("./src/joca/public-chat-runtime.ts", import.meta.url),
              ),
            },
          ]
        : [],
  },
  plugins: [react(), jocaApi()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    cors: false,
    fs: {
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/.local/**",
        "**/editorial/**",
        "**/server/**",
        "**/workers/**",
        "**/.dev.vars*",
      ],
    },
  },
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
}));
