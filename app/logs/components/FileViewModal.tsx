import { X, FileText, Download } from 'lucide-react';
import type { Log } from '@/lib/db/generated/data-types';
import { useEffect, useState } from 'react';

interface FileViewModalProps {
  log: Log;
  onClose: () => void;
}

export function FileViewModal({ log, onClose }: FileViewModalProps) {
  const [fileContent, setFileContent] = useState<string>('Loading...');

  useEffect(() => {
    if (!log.file_path) {
      setFileContent("No file path available for this log.");
      return;
    }

    console.log("Fetching file content for:", log.file_path);

    const fetchFile = async () => {
      try {
        if(!log.file_path) {
          setFileContent("No file path provided.");
          return;
        }
        const res = await fetch(
          `/api/logs/read?filePath=${encodeURIComponent(log.file_path)}`
        );

        const data = await res.json();

        if (data.content) {
          setFileContent(data.content);
        } else {
          setFileContent("Unable to read file");
        }
      } catch (error) {
        console.error("Error loading file:", error);
        setFileContent("Error loading file: " + error);
      }
    };

    fetchFile();
  }, [log.file_path]);

  const isCompressed =
    log.mime_type?.includes("gzip") ||
    log.mime_type?.includes("zip") ||
    log.mime_type?.includes("tar");

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
              <p className="text-gray-600">{log.file_path || "Unknown file"}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Section */}
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
              <p className="text-gray-900">{log.mime_type || "Unknown"}</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="h-full bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto font-mono text-sm">
            <pre className="whitespace-pre-wrap">{fileContent}</pre>
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
