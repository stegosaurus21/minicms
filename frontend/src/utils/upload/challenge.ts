import z from "zod";
import { toShape } from "./types";
import { taskDefinition, validateTask } from "./task";

export const challengeDefinition = {
  config: {
    type: "json" as const,
    find: "config.json",
    shape: z.object({
      id: z.string(),
      time_limit: z.number(),
      memory_limit: z.number(),
      title: z.string(),
      description: z.string(),
      input_format: z.string(),
      output_format: z.string(),
      constraints: z.string(),
    }),
    default: {
      time_limit: 1,
      memory_limit: 1024 * 128,
      description: "",
      input_format: "",
      output_format: "",
      constraints: "",
    },
  },

  tasks: {
    type: "folderList" as const,
    find: /task_[0-9]+/,
    content: taskDefinition,
    optional: true,
  },
};

const shape = toShape(challengeDefinition);
export type UploadChallengeType = z.infer<typeof shape>;

export async function validateChallenge(parsedZip: UploadChallengeType) {
  return {
    ...parsedZip.config,
    tasks: await Promise.all(
      parsedZip.tasks.map(async ({ data }, i) => {
        const {
          config: { examples, ...config },
          tests,
        } = await validateTask(data);
        return {
          task_number: i,
          tests: tests,
          ...config,
        };
      })
    ),
  };
}
