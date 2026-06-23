import fs from "fs-extra";
import path from "path";
import crypto from "crypto";

export async function injectGeneratedJwtSecret(targetDir: string): Promise<void> {
  const envPath = path.join(targetDir, ".env");
  const content = await fs.readFile(envPath, "utf-8");
  const secret = crypto.randomBytes(32).toString("hex");
  const updated = content.replace(
    /^JWT_SECRET=.*$/m,
    `JWT_SECRET=${secret}`
  );
  await fs.writeFile(envPath, updated);
}
