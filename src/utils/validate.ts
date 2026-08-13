import fs from "fs-extra";
import path from "path";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidProjectName(name: string): boolean {
  return NAME_PATTERN.test(name);
}

export function projectNameError(): string {
  return "Use lowercase letters, numbers, and hyphens only (no spaces).";
}

// An unquoted PostgreSQL identifier: leading letter or underscore, then letters,
// digits, underscores or $, capped at the 63-byte limit.
const DB_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_$]{0,62}$/;

export function isValidDatabaseName(name: string): boolean {
  return DB_NAME_PATTERN.test(name);
}

export function databaseNameError(): string {
  return "Start with a letter or underscore, then letters, numbers or underscores (no hyphens or spaces).";
}

export function isValidPort(port: number | undefined): boolean {
  return port !== undefined && Number.isInteger(port) && port >= 1 && port <= 65535;
}

export function portError(): string {
  return "Enter a port between 1 and 65535.";
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
