"use client";

import { useState, useEffect } from 'react';
import { LogsTable } from './components/LogsTable';
import { FileViewModal } from './components/FileViewModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { fetchLogs, deleteLog, updateLogStatus } from "./actions";
import { Log } from '@/lib/db/generated/data-types';

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [viewingFile, setViewingFile] = useState<Log | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Log | null>(null);

  // --- Fetch DB logs after mount
  useEffect(() => {
    fetchLogs().then(setLogs);
  }, []);

  const handleDelete = (id: number) => {
    deleteLog(id).then(() => {
      fetchLogs().then(setLogs);
    });
  };

  const handleStatusUpdate = (id: number, status: Log['status'],onClose:()=>void) => {
    updateLogStatus(id, status).then(() => {
      fetchLogs().then(setLogs).then(()=>{
        onClose();
      });
    });
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
