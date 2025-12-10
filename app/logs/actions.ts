"use server";

import { db } from "@/lib/db";

function parsePgArray(pgArray: string | null): string[] {
  if (!pgArray) return [];
  return pgArray
    .replace(/^\{|\}$/g, "") // remove wrapping { }
    .split(",")
    .filter(Boolean);
}

export async function fetchLogs() {
  const rows = await db
    .withSchema("debug_log")
    .selectFrom("logs")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  return rows.map(row => ({
    ...row,
    tags: parsePgArray(row.tags as unknown as string),
    status: row.status ?? 'pending',
    created_at: row.created_at instanceof Date 
      ? row.created_at 
      : new Date(row.created_at)
  }));
}
