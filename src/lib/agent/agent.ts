import { ToolLoopAgent, isStepCount, type LanguageModel } from "ai";
import { tools } from "./tools";
import { INSTRUCTIONS } from "./persona";

export function createAgent(model: LanguageModel) {
  return new ToolLoopAgent({
    model,
    instructions: INSTRUCTIONS,
    tools,
    stopWhen: isStepCount(5),
     maxRetries: 0,
  });
}


