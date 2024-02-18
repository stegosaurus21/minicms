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
import { ZipDefinition, toShape } from "./types";
import z from "zod";

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
  return result as z.infer<typeof shape>;
}

export async function parseZip<T extends ZipDefinition>(
  zip: JSZip,
  definition: T,
  path: string = ""
) {
  const result: any = {};
  await Promise.all(
    Object.keys(definition).map(async (prop) => {
      const item = definition[prop];
      switch (item.type) {
        case "json":
        case "text":
          const file = zip.file(item.find);
          if (file === null) {
            if (item.optional) {
              if (item.default) result[prop] = item.default;
              return;
            }
            throw new UploadFileNotFoundError(path, item.find);
          }
          result[prop] = await file.async("text");
          if (item.type === "text") break;
          result[prop] = parseJSON(
            result[prop],
            item.shape,
            path,
            item.find,
            item.default
          );
          break;
        case "jsonList":
        case "textList":
          const files = zip.file(item.find);
          if (files.length == 0) {
            result[prop] = [];
            if (item.optional) return;
            throw new UploadRegexNotFoundError(path, item.find.source);
          }
          result[prop] = await Promise.all(
            files.map(async (x) => ({
              name: x.name,
              data: await x.async("text"),
            }))
          );
          if (item.type === "textList") break;
          await Promise.all(
            result[prop].forEach(
              async (x: { name: string; data: any }) =>
                (x.data = parseJSON(
                  x.data,
                  item.shape,
                  path,
                  x.name,
                  item.default
                ))
            )
          );
          break;
        case "folder":
          const folder = zip.folder(item.find);
          if (folder === null) {
            if (item.optional) return;
            throw new UploadFolderNotFoundError(path, item.find);
          }
          result[prop] = await parseZip(
            folder,
            item.content,
            `${path}${item.find}/`
          );
          break;
        case "folderList":
          const folders = zip
            .folder(item.find)
            .filter((x) => x.name.indexOf("/") === x.name.lastIndexOf("/"));
          if (folders.length == 0) {
            result[prop] = [];
            if (item.optional) return;
            throw new UploadRegexNotFoundError(path, item.find.source);
          }
          result[prop] = await Promise.all(
            folders.map(async (x) => ({
              name: x.name,
              data: await parseZip(
                zip.folder(x.name) || new JSZip(),
                item.content,
                `${path}${x.name}/`
              ),
            }))
          );
          break;
      }
    })
  );

  const shape = toShape(definition);
  return result as z.infer<typeof shape>;
}
