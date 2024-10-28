import { NodeOnDiskFile } from "@remix-run/node";

export function isNodeFile(file: unknown): file is NodeOnDiskFile {
  return file instanceof NodeOnDiskFile;
}

export function isNodeFileArray(files: unknown[]): files is NodeOnDiskFile[] {
  return files.every((file) => file instanceof NodeOnDiskFile);
}
