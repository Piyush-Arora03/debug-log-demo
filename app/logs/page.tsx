"use client";

import { useState, useEffect } from 'react';
import { LogsTable } from './components/LogsTable';
import { FileViewModal } from './components/FileViewModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { fetchLogs } from "./actions";

export interface Log {
  id: number;
  device_id: string;
  tags: string[] | null;
  file_path: string | null;
  mime_type: string;
  created_at: Date;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [viewingFile, setViewingFile] = useState<Log | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Log | null>(null);

  // --- Fetch DB logs after mount
  useEffect(() => {
    fetchLogs().then(setLogs);
  }, []);

  const handleDelete = (id: number) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleStatusUpdate = (id: number, status: Log['status']) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, status } : log));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Log Management</h1>
          <p className="text-gray-600">Manage and monitor device logs</p>
        </div>

        <LogsTable
          logs={logs}
          onDelete={handleDelete}
          onViewFile={setViewingFile}
          onUpdateStatus={setUpdatingStatus}
        />

        {viewingFile && (
          <FileViewModal
            log={viewingFile}
            onClose={() => setViewingFile(null)}
          />
        )}

        {updatingStatus && (
          <StatusUpdateModal
            log={updatingStatus}
            onClose={() => setUpdatingStatus(null)}
            onUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}
