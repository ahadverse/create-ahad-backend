import fs from "fs-extra";
import path from "path";

export type Placeholders = Record<string, string>;

// Template files are prefixed so they are inert inside this repo:
//   _dot_env      -> .env          (dotfiles, including ones with an extension)
//   _package.json -> package.json  (files that would otherwise be picked up by tooling)
function renameTemplateFile(filename: string): string {
  if (filename.startsWith("_dot_")) return `.${filename.slice("_dot_".length)}`;
  if (filename.startsWith("_")) return filename.slice(1);
  return filename;
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
    const destPath = path.join(destDir, renameTemplateFile(entry.name));

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
