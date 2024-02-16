import { ZipDefinition } from "./parser";
import z from "zod";
import { TaskStructure } from "./task";

export const ChallengeStructure: ZipDefinition = [
  {
    type: "json",
    find: "config.json",
    shape: z.object({
      id: z.string(),
      time_limit: z.optional(z.number()),
      memory_limit: z.optional(z.number()),
      title: z.optional(z.string()),
      description: z.optional(z.string()),
      input_format: z.optional(z.string()),
      output_format: z.optional(z.string()),
      constraints: z.optional(z.string()),
    }),
  },
  {
    type: "directory",
    find: "tasks",
    optional: true,
    content: [{ type: "directory", find: ".*", content: TaskStructure }],
  },
];
