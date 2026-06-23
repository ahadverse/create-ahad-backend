#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { runCreateBackend } from "../command.js";

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

program.parseAsync(process.argv);
