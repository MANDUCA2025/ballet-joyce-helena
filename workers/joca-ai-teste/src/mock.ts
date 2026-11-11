import { createHandler } from "./handler";
import { answerQuestion } from "../../../src/joca/chat-service";
const handle = createHandler({ mock: true });
export default {
  fetch(request: Request, env: { LOCAL_BRIDGE_TOKEN?: string }) {
    return handle(request, env, async (input) => ({
      choices: [
        {
          finish_reason: "stop",
          message: {
            content:
              "[SIMULAÇÃO LOCAL, SEM IA] " +
              answerQuestion(input.messages.at(-1)!.content).text,
          },
        },
      ],
    }));
  },
};
