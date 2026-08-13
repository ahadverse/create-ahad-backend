#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { runCreateBackend } from "../command.js";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
) as { version: string; description: string };

const program = new Command();

program
  .name("create-ahad-backend")
  .description(pkg.description)
  .version(pkg.version)
  .action(runCreateBackend);

program.parseAsync(process.argv).catch((err: unknown) => {
  // Ctrl+C (or a closed stdin) mid-prompt: exit quietly instead of dumping a stack trace.
  if (err instanceof Error && err.name === "ExitPromptError") {
    logger.warn("\nCancelled.");
    process.exit(130);
  }
  logger.error((err as Error).message);
  process.exit(1);
});
