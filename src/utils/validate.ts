import fs from "fs-extra";
import path from "path";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidProjectName(name: string): boolean {
  return NAME_PATTERN.test(name);
}

export function projectNameError(): string {
  return "Use lowercase letters, numbers, and hyphens only (no spaces).";
}

export async function assertTargetDirAvailable(targetDir: string): Promise<void> {
  const exists = await fs.pathExists(targetDir);
  if (!exists) return;

  const stat = await fs.stat(targetDir);
  if (!stat.isDirectory()) {
    throw new Error(`Target path "${path.basename(targetDir)}" already exists and is not a directory.`);
  }

  const contents = await fs.readdir(targetDir);
  if (contents.length > 0) {
    throw new Error(`Directory "${path.basename(targetDir)}" already exists and is not empty.`);
  }
}
