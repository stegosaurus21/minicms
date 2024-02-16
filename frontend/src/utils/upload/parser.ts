import JSZip from "jszip";
import {
  UploadFileNotFoundError,
  UploadFolderNotFoundError,
  UploadInvalidJSONError,
  UploadJSONParseError,
  UploadRegexNotFoundError,
} from "./errors";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
export type ZipItemDefinition =
  | { find: string | RegExp; optional?: boolean; default?: any } & (
      | {
          type: "text";
        }
      | { type: "json"; shape: Zod.AnyZodObject }
      | {
          type: "directory";
          content: ZipItemDefinition[];
        }
    );
export type ZipDefinition = ZipItemDefinition[];

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
          if (typeof item.find === "string") {
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
          } else {
            const folders = zip.folder(item.find);
            if (folders.length == 0) {
              result[item.find.source] = [];
              if (item.optional) return;
              throw new UploadRegexNotFoundError(path, item.find.source);
            }
            result[item.find.source] = await Promise.all(
              folders.map(async (x) =>
                parseZip(
                  zip.folder(x.name) || new JSZip(),
                  item.content,
                  `${path}${x.name}/`
                )
              )
            );
          }
          break;
      }
    })
  );
  console.log(result);
  return result;
}
