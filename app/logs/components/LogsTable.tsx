"use client";
import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Edit, Trash2, ChevronDown, Calendar as CalendarIcon, X } from 'lucide-react';
import type { Log } from '../page'
import { Calendar } from './ui/calendar';
import type { DateRange } from 'react-day-picker';

interface LogsTableProps {
  logs: Log[];
  onDelete: (id: number) => void;
  onViewFile: (log: Log) => void;
  onUpdateStatus: (log: Log) => void;
}

export function LogsTable({ logs, onDelete, onViewFile, onUpdateStatus }: LogsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMimeType, setFilterMimeType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Extract unique values for filters
  const devices = useMemo(() => {
    const unique = Array.from(new Set(logs.map(log => log.device_id)));
    return unique.sort();
  }, [logs]);

  const statuses = useMemo(() => {
    const unique = Array.from(new Set(logs.map(log => log.status).filter(Boolean)));
    return unique.sort();
  }, [logs]);

  const mimeTypes = useMemo(() => {
    const unique = Array.from(new Set(logs.map(log => log.mime_type).filter(Boolean)));
    return unique.sort();
  }, [logs]);

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        log.device_id.toLowerCase().includes(searchLower) ||
        log.file_path?.toLowerCase().includes(searchLower) ||
        log.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        log.id.toString().includes(searchLower);

      // Device filter
      const matchesDevice = filterDevice === 'all' || log.device_id === filterDevice;

      // Status filter
      const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

      // MIME type filter
      const matchesMimeType = filterMimeType === 'all' || log.mime_type === filterMimeType;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange?.from) {
        const logDate = new Date(log.created_at);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          matchesDateRange = logDate >= fromDate && logDate <= toDate;
        } else {
          matchesDateRange = logDate >= fromDate;
        }
      }

      return matchesSearch && matchesDevice && matchesStatus && matchesMimeType && matchesDateRange;
    });
  }, [logs, searchTerm, filterDevice, filterStatus, filterMimeType, dateRange]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDevice('all');
    setFilterStatus('all');
    setFilterMimeType('all');
    setDateRange(undefined);
  };

  const activeFiltersCount = [
    filterDevice !== 'all' ? 1 : 0,
    filterStatus !== 'all' ? 1 : 0,
    filterMimeType !== 'all' ? 1 : 0,
    dateRange?.from ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const formatDateRange = () => {
    if (!dateRange?.from) return null;
    if (!dateRange.to) {
      return `From ${dateRange.from.toLocaleDateString()}`;
    }
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, device, file path, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Device</label>
                  <select
                    value={filterDevice}
                    onChange={(e) => setFilterDevice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Devices</option>
                    {devices.map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">File Type</label>
                  <select
                    value={filterMimeType}
                    onChange={(e) => setFilterMimeType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    {mimeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date Range</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {formatDateRange() || 'Select date range'}
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          className="p-4"
                        />
                        <div className="flex justify-end px-4 py-2 bg-gray-50">
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Device ID</th>
              <th className="px-4 py-3 text-left text-gray-700">File Path</th>
              <th className="px-4 py-3 text-left text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-gray-700">Tags</th>
              <th className="px-4 py-3 text-left text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-gray-700">Created At</th>
              <th className="px-4 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">#{log.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-mono">{log.device_id}</td>
                  <td className="px-4 py-3">
                    {log.file_path ? (
                      <span className="text-gray-900 font-mono truncate max-w-xs block" title={log.file_path}>
                        {log.file_path}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {log.mime_type ? (
                      <span className="text-gray-700">{log.mime_type}</span>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {log.tags && log.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {log.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(log.status)}`}>
                      {log.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {log.file_path && (
                        <button
                          onClick={() => onViewFile(log)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View file contents"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onUpdateStatus(log)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Update status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete log #${log.id}?`)) {
                            onDelete(log.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}