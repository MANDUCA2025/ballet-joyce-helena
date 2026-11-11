import { loadEnv, type Plugin } from "vite";
import { createChatEndpoint, readConfig, isAvailable } from "./chat-endpoint";
import { cloudflareEndpoint } from "./cloudflare-bridge";
import { createGeminiProvider } from "./provider";
export function jocaApi(): Plugin {
  return {
    name: "joca-local-api",
    apply: "serve",
    configureServer(server) {
      // Nunca retornar env ao cliente nem usar define/import.meta.env para a chave.
      const env = loadEnv(server.config.mode, server.config.root, "");
      if (env.JOCA_PROVIDER === "cloudflare") {
        const endpoint = cloudflareEndpoint(env, server.config.root);
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/api/joca/")) {
            void endpoint(req, res);
            return;
          }
          next();
        });
        return;
      }
      const config = readConfig(env);
      if (env.JOCA_PROVIDER === "local") config.enabled = false;
      const provider = isAvailable(config)
        ? createGeminiProvider(config.apiKey, config.model)
        : async () => {
            throw new Error("disabled");
          };
      const endpoint = createChatEndpoint(config, provider);
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/joca/")) {
          void endpoint(req, res);
          return;
        }
        next();
      });
    },
  };
}
