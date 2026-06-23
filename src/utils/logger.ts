import chalk from "chalk";

export const logger = {
  banner: (title: string, subtitle: string) => {
    console.log(chalk.cyan.bold(`\n${title}`));
    console.log(chalk.dim(`${subtitle}\n`));
  },
  info: (message: string) => console.log(chalk.cyan(message)),
  success: (message: string) => console.log(chalk.green(message)),
  warn: (message: string) => console.log(chalk.yellow(message)),
  error: (message: string) => console.error(chalk.red(message)),
};
