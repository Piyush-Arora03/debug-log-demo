import { Generated } from 'kysely';
export interface Log {
  id: Generated<number>;
  device_id: string;
  level: "debug" | "info" | "warn" | "error" | "exception";
  message: string;
  timestamp: Date;
  tags: unknown | null;
  file_path: string | null;      
  mime_type: string | null;      
  created_at: Generated<Date>;
}

export interface DB {
  logs: Log;
}
