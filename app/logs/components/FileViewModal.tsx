import { X, FileText, Download } from 'lucide-react';
import type { Log } from '../page';

interface FileViewModalProps {
  log: Log;
  onClose: () => void;
}

// Mock function to simulate decompressing and reading file contents
const getMockFileContents = (filePath: string, mimeType: string | null): string => {
  const fileName = filePath.split('/').pop() || 'unknown';
  
  // Simulate different file contents based on mime type
  if (mimeType?.includes('gzip') || mimeType?.includes('zip') || mimeType?.includes('tar')) {
    // Simulated decompressed log content
    return `[2025-12-09 10:23:45] INFO: Application started successfully
[2025-12-09 10:23:46] DEBUG: Loading configuration from /etc/app/config.json
[2025-12-09 10:23:46] INFO: Database connection established
[2025-12-09 10:23:47] INFO: Server listening on port 3000
[2025-12-09 10:24:15] WARNING: High memory usage detected (85%)
[2025-12-09 10:24:16] INFO: Cache cleared successfully
[2025-12-09 10:25:30] ERROR: Failed to connect to external API
[2025-12-09 10:25:30] ERROR: Network timeout after 30 seconds
[2025-12-09 10:25:31] INFO: Retrying connection...
[2025-12-09 10:25:33] INFO: Connection successful on retry
[2025-12-09 10:30:45] INFO: Processing batch job #1234
[2025-12-09 10:30:46] DEBUG: Processing 500 records
[2025-12-09 10:30:50] INFO: Batch job completed (4.2s)
[2025-12-09 10:35:12] WARNING: Disk space running low (15% remaining)
[2025-12-09 10:40:00] INFO: Scheduled backup initiated
[2025-12-09 10:41:23] INFO: Backup completed successfully

--- End of log file ---`;
  } else if (mimeType?.includes('json')) {
    return JSON.stringify({
      timestamp: '2025-12-09T10:23:45Z',
      level: 'info',
      message: 'Application logs',
      events: [
        { time: '10:23:45', type: 'startup', status: 'success' },
        { time: '10:24:15', type: 'warning', message: 'High memory usage' },
        { time: '10:25:30', type: 'error', message: 'API connection failed' }
      ],
      metadata: {
        version: '1.0.0',
        environment: 'production'
      }
    }, null, 2);
  } else {
    return `Log file: ${fileName}
Generated at: ${new Date().toISOString()}

This is a sample log file content.
In a real application, this would display the actual decompressed contents
of the file stored at: ${filePath}

Sample log entries:
- System startup completed
- Services initialized
- Application ready to accept connections`;
  }
};

export function FileViewModal({ log, onClose }: FileViewModalProps) {
  const fileContents = log.file_path ? getMockFileContents(log.file_path, log.mime_type) : 'No file content available';
  const isCompressed = log.mime_type?.includes('gzip') || log.mime_type?.includes('zip') || log.mime_type?.includes('tar');

  const handleDownload = () => {
    const blob = new Blob([fileContents], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-${log.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-gray-900">File Contents</h2>
              <p className="text-gray-600">
                {log.file_path || 'Unknown file'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-600">Log ID</span>
              <p className="text-gray-900">#{log.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Device</span>
              <p className="text-gray-900 font-mono">{log.device_id}</p>
            </div>
            <div>
              <span className="text-gray-600">Type</span>
              <p className="text-gray-900">{log.mime_type || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-gray-600">Created</span>
              <p className="text-gray-900">
                {new Date(log.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isCompressed && (
            <div className="mt-3 flex items-center gap-2 text-blue-600">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Showing decompressed contents</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto font-mono text-sm">
            <pre className="whitespace-pre-wrap">{fileContents}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
