"use client";
import { useState } from 'react';
import { X, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Log } from '../page';

interface StatusUpdateModalProps {
  log: Log;
  onClose: () => void;
  onUpdate: (id: number, status: Log['status']) => void;
}

const statusOptions: Array<{ value: Log['status']; label: string; icon: any; color: string }> = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
  { value: 'processing', label: 'Processing', icon: AlertCircle, color: 'text-blue-600' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
  { value: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-600' },
];

export function StatusUpdateModal({ log, onClose, onUpdate }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Log['status']>(log.status);

  const handleUpdate = () => {
    onUpdate(log.id, selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Update Log Status</h2>
            <p className="text-gray-600">Log #{log.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Log Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Device ID:</span>
                <span className="text-gray-900 font-mono">{log.device_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File:</span>
                <span className="text-gray-900 truncate max-w-[200px]" title={log.file_path || 'N/A'}>
                  {log.file_path ? log.file_path.split('/').pop() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className="text-gray-900">{log.status || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedStatus === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${option.color}`} />
                    <span className="text-gray-900">{option.label}</span>
                    {selectedStatus === option.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
