import { createHandler, MODEL } from "./handler";
const handle = createHandler();
export default {
  fetch(request, env) {
    return handle(request, env, async (input) => env.AI.run(MODEL, input));
  },
} satisfies ExportedHandler<JocaWorkerEnv>;
