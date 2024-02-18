import z from "zod";

export type ZipItemMetadata = {
  type: string;
  find: string;
  optional?: boolean;
};

export type ZipItemListMetadata = {
  type: string;
  find: RegExp;
  optional?: boolean;
};

export type ZipJSONFileDefinition<T extends z.AnyZodObject> = {
  type: "json";
  shape: T;
  default?: Partial<z.infer<T>>;
} & ZipItemMetadata;
export type ZipJSONFileShape<T extends ZipJSONFileDefinition<any>> = T["shape"];

export type ZipTextFileDefinition = {
  type: "text";
  default?: string;
} & ZipItemMetadata;
export type ZipTextFileShape = z.ZodString;

export type ZipJSONFileListDefinition<T extends z.ZodType> = {
  type: "jsonList";
  shape: T;
  default?: Partial<z.infer<T>>;
} & ZipItemListMetadata;
export type ZipJSONFileListShape<T extends ZipJSONFileListDefinition<any>> =
  z.ZodArray<
    z.ZodObject<{
      data: T["shape"];
      name: z.ZodString;
    }>
  >;

export type ZipTextFileListDefinition = {
  type: "textList";
  default?: string;
} & ZipItemListMetadata;
export type ZipTextFileListShape = z.ZodArray<
  z.ZodObject<{ data: z.ZodString; name: z.ZodString }>
>;

export type ZipFolderDefinition = {
  type: "folder";
  content: {
    [k: string]: ZipItemOrListDefinition;
  };
} & ZipItemMetadata;
export type ZipFolderShape<T extends ZipFolderDefinition> = z.ZodObject<{
  [k in keyof T["content"]]: ItemShape<T["content"][k]>;
}>;

export type ZipFolderListDefinition = {
  type: "folderList";
  content: {
    [k: string]: ZipItemOrListDefinition;
  };
} & ZipItemListMetadata;
export type ZipFolderListShape<T extends ZipFolderListDefinition> = z.ZodArray<
  z.ZodObject<{
    data: z.ZodObject<{
      [k in keyof T["content"]]: ItemShape<T["content"][k]>;
    }>;
    name: z.ZodString;
  }>
>;

export type ZipDefinition = {
  [k: string]: ZipItemOrListDefinition;
};
export type ZipShape<T extends ZipDefinition> = z.ZodObject<{
  [k in keyof T]: ItemShape<T[k]>;
}>;

export type ZipItemOrListDefinition =
  | ZipJSONFileDefinition<any>
  | ZipTextFileDefinition
  | ZipFolderDefinition
  | ZipJSONFileListDefinition<any>
  | ZipTextFileListDefinition
  | ZipFolderListDefinition;

export type ItemShape<T extends ZipItemOrListDefinition> =
  T extends ZipJSONFileDefinition<any>
    ? ZipJSONFileShape<T>
    : T extends ZipJSONFileListDefinition<any>
    ? ZipJSONFileListShape<T>
    : T extends ZipTextFileDefinition
    ? ZipTextFileShape
    : T extends ZipTextFileListDefinition
    ? ZipTextFileListShape
    : T extends ZipFolderDefinition
    ? ZipFolderShape<T>
    : T extends ZipFolderListDefinition
    ? ZipFolderListShape<T>
    : never;

export const toShape = <T extends ZipDefinition>(x: T): ZipShape<T> => {
  return 0 as any;
};
