export type ZipItemDefinition =
  | ({ find: string | RegExp; optional?: boolean; default?: any } & (
      | {
          type: "text";
        }
      | { type: "json"; shape: Zod.AnyZodObject }
    ))
  | {
      type: "directory";
      find: string;
      optional?: boolean;
      content: ZipItemDefinition[];
    };

export type ZipDefinition = ZipItemDefinition[];

import JSZip from "jszip";
import { z } from "zod";
import { ZodError, fromZodError } from "zod-validation-error";

export const TaskStructure: ZipDefinition = [
  {
    type: "json",
    find: "config.json",
    optional: true,
    shape: z.object({
      weight: z.optional(z.number()),
      type: z.optional(z.enum(["BATCH", "INDIVIDUAL"])),
    }),
    default: {
      weight: 1,
      type: "INDIVIDUAL",
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
  config: { weight: number; type: string };
  tests: { name: string; input: string; output: string }[];
};

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
  // Convert inputs and outputs into correct format
  result.tests = input.map((x) => ({
    name: x.name,
    input: x.data,
    output: output.find((y) => x.name === y.name)?.data || "",
  }));
  return result;
}

export abstract class UploadError extends Error {
  constructor(path: string, leaf: string, message: string) {
    super();
    this.message = `${path}/${leaf}: ${message}`;
  }
}
class UploadFileNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "File not found");
  }
}
class UploadFolderNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "Folder not found");
  }
}
class UploadRegexNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "No matches found for regex");
  }
}
class UploadInvalidJSONError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "Invalid JSON");
  }
}
class UploadJSONParseError extends UploadError {
  constructor(path: string, leaf: string, parseError: string) {
    super(path, leaf, parseError);
  }
}
class UploadTaskParseError extends UploadError {
  constructor(property: string, message: string) {
    super("parsed", property, message);
  }
}

export async function uploadFile(): Promise<File | undefined> {
  let resolver: (value: FileList | null | PromiseLike<FileList | null>) => void;
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  document.body.appendChild(input);
  input.onchange = () => {
    if (!resolver) return;
    resolver(input.files);
  };
  input.oncancel = () => {
    resolver(null);
  };
  const files = await new Promise<FileList | null>((resolve) => {
    resolver = resolve;
    input.click();
  });
  if (files === null) return undefined;
  const file = files.item(0);
  if (file === null) return undefined;
  const result = new File([file], file.name, { type: file.type });
  input.remove();
  return result;
}

export async function uploadFileText(): Promise<string | undefined> {
  const file = await uploadFile();
  if (!file) return undefined;
  return await file.text();
}

function parseJSON(
  json: string,
  shape: Zod.AnyZodObject,
  path: string,
  leaf: string,
  defaults: any
) {
  let result: any;
  // Try and parse the string
  try {
    result = JSON.parse(json);
  } catch (err) {
    throw new UploadInvalidJSONError(path, leaf);
  }
  // Insert defaults
  if (defaults) {
    Object.keys(defaults).forEach((x) => {
      if (result[x] === undefined) result[x] = defaults[x];
    });
  }
  // Validate against schema
  try {
    shape.parse(result);
  } catch (err) {
    throw new UploadJSONParseError(
      path,
      leaf,
      fromZodError(err as ZodError).toString()
    );
  }
  return result;
}

export async function parseZip(
  zip: JSZip,
  shape: ZipDefinition,
  path: string = ""
) {
  const result: any = {};
  await Promise.all(
    shape.map(async (item) => {
      switch (item.type) {
        case "text":
        case "json":
          if (typeof item.find === "string") {
            const file = zip.file(item.find);
            if (file === null) {
              if (item.optional) {
                if (item.default) result[item.find] = item.default;
                return;
              }
              throw new UploadFileNotFoundError(path, item.find);
            }
            result[item.find] = await file.async("text");
            if (item.type === "text") break;
            result[item.find] = parseJSON(
              result[item.find],
              item.shape,
              path,
              item.find,
              item.default
            );
          } else {
            const files = zip.file(item.find);
            if (files.length == 0) {
              result[item.find.source] = [];
              if (item.optional) return;
              throw new UploadRegexNotFoundError(path, item.find.source);
            }
            result[item.find.source] = await Promise.all(
              files.map(async (x) => ({
                name: x.name,
                data: await x.async("text"),
              }))
            );
            if (item.type === "text") break;
            result[item.find.source] = await Promise.all(
              (result[item.find.source] as string[]).map(async (x, i) => ({
                name: files[i].name,
                data: await parseJSON(
                  x,
                  item.shape,
                  path,
                  files[i].name,
                  item.default
                ),
              }))
            );
          }
          break;
        case "directory":
          const folder = zip.folder(item.find);
          if (folder === null) {
            if (item.optional) return;
            throw new UploadFolderNotFoundError(path, item.find);
          }
          result[item.find] = await parseZip(
            folder,
            item.content,
            `${path}${item.find}/`
          );
          break;
      }
    })
  );
  console.log(result);
  return result;
}
