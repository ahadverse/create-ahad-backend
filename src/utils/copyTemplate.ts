import fs from "fs-extra";
import path from "path";

export type Placeholders = Record<string, string>;

function renameUnderscoreFile(filename: string): string {
  if (!filename.startsWith("_")) return filename;
  const rest = filename.slice(1);
  const hasExtension = rest.includes(".");
  return hasExtension ? rest : `.${rest}`;
}

function applyPlaceholders(content: string, placeholders: Placeholders): string {
  let result = content;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.split(key).join(value);
  }
  return result;
}

async function copyDir(sourceDir: string, destDir: string, placeholders: Placeholders): Promise<void> {
  await fs.ensureDir(destDir);
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, renameUnderscoreFile(entry.name));

    if (entry.isDirectory()) {
      await copyDir(sourcePath, destPath, placeholders);
    } else {
      const content = await fs.readFile(sourcePath, "utf-8");
      await fs.writeFile(destPath, applyPlaceholders(content, placeholders));
    }
  }
}

export async function copyTemplate(
  sourceDir: string,
  destDir: string,
  placeholders: Placeholders
): Promise<void> {
  await copyDir(sourceDir, destDir, placeholders);
}
