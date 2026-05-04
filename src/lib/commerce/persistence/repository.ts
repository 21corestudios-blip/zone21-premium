import type { CommerceRepository } from "./types";
import { FileCommerceRepository } from "./file-repository";
import { MySqlCommerceRepository } from "./mysql-repository";

let repository: CommerceRepository | null = null;

export function getCommerceRepository(): CommerceRepository {
  if (repository) {
    return repository;
  }

  if (process.env.DATABASE_URL) {
    repository = new MySqlCommerceRepository();
    return repository;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production. File persistence is local-only.",
    );
  }

  repository = new FileCommerceRepository();
  return repository;
}
