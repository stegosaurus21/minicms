import { z } from "zod";
import { UploadError } from "./errors";
import { toShape } from "./types";

export const taskDefinition = {
  config: {
    type: "json" as const,
    find: "config.json",
    optional: true,
    shape: z.object({
      weight: z.number(),
      type: z.enum(["BATCH", "INDIVIDUAL"]),
      examples: z.array(
        z.union([
          z.string(),
          z.object({ name: z.string(), explanation: z.string() }),
        ])
      ),
      constraints: z.string(),
    }),
    default: {
      weight: 1,
      type: "INDIVIDUAL",
      examples: [],
      constraints: "",
    },
  },
  input: {
    type: "folder" as const,
    find: "input",
    content: {
      tests: {
        type: "textList" as const,
        find: new RegExp(".*"),
        optional: true,
      },
    },
  },
  output: {
    type: "folder" as const,
    find: "output",
    content: {
      tests: {
        type: "textList" as const,
        find: new RegExp(".*"),
        optional: true,
      },
    },
  },
};

const shape = toShape(taskDefinition);
type UploadTaskType = z.infer<typeof shape>;

class UploadTaskParseError extends UploadError {
  constructor(property: string, message: string) {
    super("parsed", property, message);
  }
}

export async function validateTask(parsedZip: UploadTaskType) {
  const {
    input: { tests: input },
    output: { tests: output },
  } = parsedZip;
  // Trim test file names
  input.forEach(
    (x) => (x.name = x.name.substring(x.name.lastIndexOf("/") + 1))
  );
  output.forEach(
    (x) => (x.name = x.name.substring(x.name.lastIndexOf("/") + 1))
  );
  // Check that all inputs have outputs and vice versa
  input.forEach((x) => {
    if (output.find((y) => x.name === y.name) === undefined)
      throw new UploadTaskParseError(
        "input",
        `Input file "${x.name}" has no matching output file`
      );
  });
  output.forEach((x) => {
    if (input.find((y) => x.name === y.name) === undefined)
      throw new UploadTaskParseError(
        "output",
        `Output file "${x.name}" has no matching input file`
      );
  });
  // Convert inputs and outputs into correct format
  const result = {
    config: parsedZip.config,
    tests: input.map((x, i) => ({
      input: x.data,
      test_number: i,
      output: output.find((y) => x.name === y.name)?.data || "",
      is_example: false,
      explanation: "",
      comment: "",
    })),
  };
  // Check that all examples match a test
  result.config.examples.forEach((x) => {
    let name: string;
    if (typeof x === "string") name = x;
    else name = x.name;
    if (input.find((y) => name === y.name) === undefined)
      throw new UploadTaskParseError(
        "output",
        `Example "${name}" has no matching test`
      );
  });
  return result;
}
