export abstract class UploadError extends Error {
  constructor(path: string, leaf: string, message: string) {
    super();
    this.message = `${path}/${leaf}: ${message}`;
  }
}
export class UploadFileNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "File not found");
  }
}
export class UploadFolderNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "Folder not found");
  }
}
export class UploadRegexNotFoundError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "No matches found for regex");
  }
}
export class UploadInvalidJSONError extends UploadError {
  constructor(path: string, leaf: string) {
    super(path, leaf, "Invalid JSON");
  }
}
export class UploadJSONParseError extends UploadError {
  constructor(path: string, leaf: string, parseError: string) {
    super(path, leaf, parseError);
  }
}
