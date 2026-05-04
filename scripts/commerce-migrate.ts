import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run commerce migrations.");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const migrationPath = path.join(
    process.cwd(),
    "db",
    "migrations",
    "001_commerce_core.sql",
  );
  const sql = await readFile(migrationPath, "utf8");

  for (const statement of sql
    .split(/;\s*$/m)
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    await connection.query(statement);
  }

  await connection.end();
  console.log("Commerce migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
