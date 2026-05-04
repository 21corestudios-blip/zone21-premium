import type { RowDataPacket } from "mysql2";

export function toJson(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function fromJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value as T;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function firstRow<T extends RowDataPacket>(rows: T[]) {
  return rows[0] || null;
}
