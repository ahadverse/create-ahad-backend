export const logger = {
  info: (message: string) => console.log(`[info] ${message}`),
  warn: (message: string) => console.warn(`[warn] ${message}`),
  error: (message: string, err?: unknown) => {
    console.error(`[error] ${message}`);
    if (err instanceof Error) {
      console.error(err.stack ?? err.message);
    } else if (err !== undefined) {
      console.error(err);
    }
  },
};
