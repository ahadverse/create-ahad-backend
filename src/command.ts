import { input, number } from "@inquirer/prompts";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import ora from "ora";
import { logger } from "./utils/logger.js";
import {
  isValidProjectName,
  projectNameError,
  isValidDatabaseName,
  databaseNameError,
  isValidPort,
  portError,
  assertTargetDirAvailable,
} from "./utils/validate.js";
import { copyTemplate } from "./utils/copyTemplate.js";
import { injectGeneratedJwtSecret } from "./utils/writeEnv.js";

// Resolved from the bundled entry at dist/bin/index.js, so templates/ sits two levels up.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "../../templates/api");

function toDbName(projectName: string): string {
  return projectName.replace(/-/g, "_");
}

export async function runCreateBackend(): Promise<void> {
  logger.banner(
    "create-ahad-backend",
    "Scaffold an Express + TypeScript + TypeORM + PostgreSQL + JWT backend."
  );

  const projectName = await input({
    message: "Project name:",
    default: "my-api",
    validate: (value) => isValidProjectName(value) || projectNameError(),
  });

  const targetDir = path.resolve(process.cwd(), projectName);
  // An empty directory the user made themselves is a valid target, but it is not
  // ours to delete if scaffolding fails partway.
  const targetDirExisted = await fs.pathExists(targetDir);

  try {
    await assertTargetDirAvailable(targetDir);
  } catch (err) {
    logger.error((err as Error).message);
    process.exitCode = 1;
    return;
  }

  const dbName = await input({
    message: "Database name:",
    default: toDbName(projectName),
    validate: (value) => isValidDatabaseName(value) || databaseNameError(),
  });

  const port = await number({
    message: "Server port:",
    default: 4000,
    validate: (value) => isValidPort(value) || portError(),
  });

  const spinner = ora("Creating project...").start();

  try {
    await copyTemplate(TEMPLATE_DIR, targetDir, {
      __PROJECT_NAME__: projectName,
      __DB_NAME__: dbName,
      __PORT__: String(port ?? 4000),
    });
    await injectGeneratedJwtSecret(targetDir);
    spinner.succeed("Project created.");
  } catch (err) {
    spinner.fail("Failed to create project.");
    await fs.remove(targetDir);
    if (targetDirExisted) await fs.ensureDir(targetDir);
    logger.error((err as Error).message);
    process.exitCode = 1;
    return;
  }

  logger.success(`\nDone! Next steps:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm run migration:run`);
  console.log(`  npm run dev\n`);
}
