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
