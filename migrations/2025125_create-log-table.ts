import { Migration } from "kysely";

export class CreateLogsTable implements Migration {
  async up(db: any): Promise<void> {
    await db.schema
      .createTable("debug_log.logs")
      .addColumn("id", "serial", col => col.primaryKey())
      .addColumn("device_id", "text", col => col.notNull())
      .addColumn("level", "text", col =>
        col.notNull().check(db.raw(`level IN ('debug','info','warn','error','exception')`))
      )
      .addColumn("message", "text", col => col.notNull())
      .addColumn("timestamp", "timestamp", col => col.notNull().defaultTo(db.raw("now()")))
      .addColumn("tags", "jsonb")
      .addColumn("file_path", "text")
      .addColumn("mime_type", "text")
      .addColumn("created_at", "timestamp", col =>
        col.notNull().defaultTo(db.raw("now()"))
      )
      .execute();
  }

  async down(db: any): Promise<void> {
    await db.schema.dropTable("logs").execute();
  }
}