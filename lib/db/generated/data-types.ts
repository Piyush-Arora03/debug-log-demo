import { Generated } from 'kysely';
export interface Log {
  id: number;
  device_id: string;
  tags: string[] | null;
  file_path: string | null;
  mime_type: string;
  created_at: Date;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface DB {
  logs: Log;
}
