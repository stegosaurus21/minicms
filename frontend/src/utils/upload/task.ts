import { z } from "zod";
import { ZodError, fromZodError } from "zod-validation-error";
import { ZipDefinition } from "./parser";
import { UploadError } from "./errors";

export const TaskStructure: ZipDefinition = [
  {
    type: "json",
    find: "config.json",
    optional: true,
    shape: z.object({
      weight: z.optional(z.number()),
      type: z.optional(z.enum(["BATCH", "INDIVIDUAL"])),
      examples: z.optional(
        z.array(
          z.union([
            z.string(),
            z.object({ name: z.string(), explanation: z.string() }),
          ])
        )
      ),
      constraints: z.optional(z.string()),
    }),
    default: {
      weight: 1,
      type: "INDIVIDUAL",
      examples: [],
      constraints: "",
    },
  },
  {
    type: "directory",
    find: "input",
    content: [{ type: "text", find: new RegExp(".*"), optional: true }],
  },
  {
    type: "directory",
    find: "output",
    content: [{ type: "text", find: new RegExp(".*"), optional: true }],
  },
];

export type UploadTaskData = {
  config: {
    weight: number;
    type: string;
    constraints: string;
    examples: (string | { name: string; explanation: string })[];
  };
  tests: { name: string; input: string; output: string }[];
};

class UploadTaskParseError extends UploadError {
  constructor(property: string, message: string) {
    super("parsed", property, message);
  }
}

export async function validateTask(parsedZip: any) {
  const result: UploadTaskData = {
    config: parsedZip["config.json"],
    tests: [],
  };
  const input: { name: string; data: string }[] = parsedZip["input"][".*"];
  const output: { name: string; data: string }[] = parsedZip["output"][".*"];
  // Trim input/ and output/ from file names
  input.forEach((x) => (x.name = x.name.substring(x.name.indexOf("/") + 1)));
  output.forEach((x) => (x.name = x.name.substring(x.name.indexOf("/") + 1)));
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
  // Convert inputs and outputs into correct format
  result.tests = input.map((x) => ({
    name: x.name,
    input: x.data,
    output: output.find((y) => x.name === y.name)?.data || "",
  }));
  return result;
}
