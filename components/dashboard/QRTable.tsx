'use client';

import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { QRCode } from '@/lib/supabase/types';

interface QRTableProps {
  qrCodes: QRCode[];
  isDark: boolean;
  sortField: 'name' | 'url' | 'created_at';
  sortDirection: 'asc' | 'desc';
  editingNameId: string | null;
  editingName: string;
  deletingId: string | null;
  onSort: (field: 'name' | 'url' | 'created_at') => void;
  onStartRename: (qr: QRCode) => void;
  onCancelRename: () => void;
  onSaveRename: (qrId: string) => void;
  onEdit: (qr: QRCode) => void;
  onDeleteClick: (id: string) => void;
  onEditingNameChange: (name: string) => void;
}

export function QRTable({
  qrCodes,
  isDark,
  sortField,
  sortDirection,
  editingNameId,
  editingName,
  deletingId,
  onSort,
  onStartRename,
  onCancelRename,
  onSaveRename,
  onEdit,
  onDeleteClick,
  onEditingNameChange,
}: QRTableProps) {
  const SortIcon = ({ field }: { field: 'name' | 'url' | 'created_at' }) => {
    if (sortField !== field) {
      return <ArrowUpIcon className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUpIcon className="w-4 h-4" />
      : <ArrowDownIcon className="w-4 h-4" />;
  };

  return (
    <div className={`rounded-[2rem] border overflow-hidden ${
      isDark
        ? 'border-white/10 bg-white/5'
        : 'border-black/5 bg-white'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
              <th
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-white/60' : 'text-black/60'
              }`}>
                Type
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
                onClick={() => onSort('url')}
              >
                <div className="flex items-center gap-2">
                  URL
                  <SortIcon field="url" />
                </div>
              </th>
              <th
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
                onClick={() => onSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  Created
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-white/60' : 'text-black/60'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {qrCodes.map((qr, index) => {
              const isDynamic = qr.settings?.isDynamic || false;
              const isEditing = editingNameId === qr.id;
              const isDeleted = !!qr.deleted_at;

              return (
                <tr
                  key={qr.id}
                  className={`group border-b transition-colors ${
                    isDeleted
                      ? isDark
                        ? 'bg-white/5 opacity-50'
                        : 'bg-black/5 opacity-50'
                      : isDark
                      ? 'border-white/5 hover:bg-white/5'
                      : 'border-black/5 hover:bg-black/5'
                  } ${index === qrCodes.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className={`px-6 py-4 font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                    {isDeleted ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through opacity-60">{qr.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          isDark
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          Deleted
                        </span>
                      </div>
                    ) : isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => onEditingNameChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onSaveRename(qr.id);
                            } else if (e.key === 'Escape') {
                              onCancelRename();
                            }
                          }}
                          className={`px-3 py-1 rounded-lg border-2 ${
                            isDark
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-white border-black/20 text-black'
                          } focus:outline-none focus:border-blue-600`}
                          autoFocus
                        />
                        <button
                          onClick={() => onSaveRename(qr.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={onCancelRename}
                          className="px-3 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-500 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{qr.name}</span>
                        {!isDeleted && (
                          <button
                            onClick={() => onStartRename(qr)}
                            className={`opacity-40 hover:opacity-100 transition-opacity p-1 rounded ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                            }`}
                            title="Rename"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isDynamic ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        isDark
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-green-100 text-green-700 border border-green-300'
                      }`}>
                        Dynamic
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        isDark
                          ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        Static
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    <div className={`max-w-md truncate ${isDeleted ? 'line-through opacity-60' : ''}`} title={qr.url}>
                      {qr.url}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {new Date(qr.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {isDeleted ? (
                      <div className="flex items-center justify-end">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          isDark ? 'text-white/40' : 'text-black/40'
                        }`}>
                          Deleted
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() => onEdit(qr)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-xs hover:bg-blue-500 transition-all flex items-center gap-2"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteClick(qr.id)}
                          disabled={deletingId === qr.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-xs hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {deletingId === qr.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
