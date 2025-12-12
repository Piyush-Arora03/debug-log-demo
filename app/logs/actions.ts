"use server";

import { db } from "@/lib/db";

export async function fetchLogs() {
  const rows = await db
    .withSchema("debug_log")
    .selectFrom("logs")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  return rows.map(row => ({
    ...row,
    tags:row.tags?? 'error',
    status: row.status ?? 'pending',
    created_at: row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at)
  }));
}

export async function updateLogStatus(id: number, status: 'pending' | 'processing' | 'completed' | 'failed') {
  await db
    .withSchema("debug_log")
    .updateTable("logs")
    .set({ status })
    .where("id", "=", id)
    .execute();
}

export async function deleteLog(id: number) {
  await db
    .withSchema("debug_log")
    .deleteFrom("logs")
    .where("id", "=", id)
    .execute();
}
