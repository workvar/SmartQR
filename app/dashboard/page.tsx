'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { QRCode } from '@/lib/supabase/types';
import { getUserData, getUserQRCodes, deleteQRCode, getDynamicQRQuota, renameQRCode } from '@/app/actions';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type SortField = 'name' | 'url' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const settings = useAppSelector((state: any) => state.qrSettings);
  const dispatch = useAppDispatch();
  const isDark = settings.theme === 'dark';

  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ qr_count: number; ai_suggestions_used: number } | null>(null);
  const [dynamicQRQuota, setDynamicQRQuota] = useState<{ count: number; limit: number; canCreate: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
      loadQRCodes();
      loadDynamicQRQuota();
    }
  }, [isLoaded, user]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && confirmingDeleteId) {
        setConfirmingDeleteId(null);
      }
    };

    if (confirmingDeleteId) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [confirmingDeleteId]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const data = await getUserData();
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadQRCodes = async () => {
    if (!user) return;

    try {
      const data = await getUserQRCodes();
      setQrCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDynamicQRQuota = async () => {
    if (!user) return;

    try {
      const data = await getDynamicQRQuota();
      setDynamicQRQuota(data);
    } catch (error) {
      console.error('Error loading dynamic QR quota:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmingDeleteId(id);
  };

  const handleDeleteCancel = () => {
    setConfirmingDeleteId(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    setConfirmingDeleteId(null);
    setDeletingId(id);
    try {
      const result = await deleteQRCode(id);

      if (!result.success) {
        alert(result.error || 'Failed to delete QR code');
      } else {
        // Remove from UI (soft delete - count stays the same)
        setQrCodes(qrCodes.filter(qr => qr.id !== id));
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (qr: QRCode) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editingQR', JSON.stringify({
        id: qr.id,
        settings: qr.settings,
        name: qr.name,
      }));
    }
    router.push('/create/content');
  };

  const handleStartRename = (qr: QRCode) => {
    setEditingNameId(qr.id);
    setEditingName(qr.name);
  };

  const handleCancelRename = () => {
    setEditingNameId(null);
    setEditingName('');
  };

  const handleSaveRename = async (qrId: string) => {
    if (!editingName.trim()) {
      alert('Name cannot be empty');
      return;
    }

    try {
      const result = await renameQRCode(qrId, editingName);
      if (!result.success) {
        alert(result.error || 'Failed to rename QR code');
      } else {
        // Update the QR code in the list
        setQrCodes(qrCodes.map(qr =>
          qr.id === qrId ? { ...qr, name: editingName.trim() } : qr
        ));
        setEditingNameId(null);
        setEditingName('');
      }
    } catch (error) {
      console.error('Error renaming QR code:', error);
      alert('Failed to rename QR code');
    }
  };

  const toggleTheme = () => {
    dispatch(updateSettings({ theme: isDark ? 'light' : 'dark' }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedQRCodes = useMemo(() => {
    const sorted = [...qrCodes].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'url':
          aValue = a.url.toLowerCase();
          bValue = b.url.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [qrCodes, sortField, sortDirection]);

  const canCreateNew = userData ? userData.qr_count < 4 : true;
  const remainingQRs = userData ? Math.max(0, 4 - userData.qr_count) : 4;
  const remainingAISuggestions = userData ? Math.max(0, 2 - userData.ai_suggestions_used) : 2;
  const remainingDynamicQRs = dynamicQRQuota ? Math.max(0, dynamicQRQuota.limit - dynamicQRQuota.count) : 1;

  // Pie chart data for QR codes
  const qrChartData = [
    { name: 'Used', value: userData?.qr_count || 0, color: isDark ? '#3b82f6' : '#2563eb' },
    { name: 'Remaining', value: remainingQRs, color: isDark ? '#1e293b' : '#e2e8f0' },
  ];

  // Pie chart data for AI suggestions
  const aiChartData = [
    { name: 'Used', value: userData?.ai_suggestions_used || 0, color: isDark ? '#8b5cf6' : '#7c3aed' },
    { name: 'Remaining', value: remainingAISuggestions, color: isDark ? '#1e293b' : '#e2e8f0' },
  ];

  // Pie chart data for Dynamic QR codes
  const dynamicQRChartData = [
    { name: 'Used', value: dynamicQRQuota?.count || 0, color: isDark ? '#10b981' : '#059669' },
    { name: 'Remaining', value: remainingDynamicQRs, color: isDark ? '#1e293b' : '#e2e8f0' },
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpIcon className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUpIcon className="w-4 h-4" />
      : <ArrowDownIcon className="w-4 h-4" />;
  };

  if (!isLoaded || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-[#F5F5F7]'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out ${isDark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
      {/* Header */}
      <header className={`h-16 border-b sticky top-0 z-50 flex items-center backdrop-blur-md transition-colors ${isDark ? 'border-white/10 bg-black/70' : 'border-black/5 bg-white/70'}`}>
        <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">N</span>
            </div>
            <span className="text-sm font-bold tracking-tight">NovaQR Studio</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-6 py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3">
                My QR Codes
              </h1>
              <p className={`text-base ${isDark ? 'text-white/60' : 'text-[#1D1D1F]/60'}`}>
                Manage and create your QR codes
              </p>
            </div>
            <Link
              href="/create/content"
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-xl ${canCreateNew
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-50'
                }`}
            >
              <PlusIcon className="w-5 h-5" />
              Create New
            </Link>
          </div>

          {/* Pie Charts for Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* QR Codes Chart */}
            <div className={`p-4 rounded-2xl border transition-all ${canCreateNew
              ? isDark
                ? 'border-white/10 bg-white/5'
                : 'border-black/5 bg-white'
              : isDark
                ? 'border-orange-500/30 bg-orange-500/10'
                : 'border-orange-500/30 bg-orange-50'
              }`}>
              <div className="mb-3">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  QR Codes Usage
                </p>
                <p className="text-2xl font-bold mb-0.5">
                  {userData?.qr_count || 0} / 4
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {remainingQRs} QR code{remainingQRs !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qrChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {qrChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Suggestions Chart */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark
              ? 'border-white/10 bg-white/5'
              : 'border-black/5 bg-white'
              }`}>
              <div className="mb-3">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  AI Suggestions Usage
                </p>
                <p className="text-2xl font-bold mb-0.5">
                  {userData?.ai_suggestions_used || 0} / 2
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {remainingAISuggestions} suggestion{remainingAISuggestions !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {aiChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dynamic QR Codes Chart */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark
              ? 'border-white/10 bg-white/5'
              : 'border-black/5 bg-white'
              }`}>
              <div className="mb-3">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  Dynamic QR Usage
                </p>
                <p className="text-2xl font-bold mb-0.5">
                  {dynamicQRQuota?.count || 0} / {dynamicQRQuota?.limit || 1}
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {remainingDynamicQRs} QR code{remainingDynamicQRs !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicQRChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {dynamicQRChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes Table */}
        {qrCodes.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-black/5'
              }`}>
              <QrCodeIcon className={`w-12 h-12 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              No QR codes yet
            </h3>
            <p className={`text-base mb-8 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Create your first QR code to get started
            </p>
            <Link
              href="/create/content"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First QR Code
            </Link>
          </div>
        ) : (
          <div className={`rounded-[2rem] border overflow-hidden ${isDark
            ? 'border-white/10 bg-white/5'
            : 'border-black/5 bg-white'
            }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${isDark ? 'text-white/60' : 'text-black/60'
                        }`}
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-black/60'
                      }`}>
                      Type
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${isDark ? 'text-white/60' : 'text-black/60'
                        }`}
                      onClick={() => handleSort('url')}
                    >
                      <div className="flex items-center gap-2">
                        URL
                        <SortIcon field="url" />
                      </div>
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity ${isDark ? 'text-white/60' : 'text-black/60'
                        }`}
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        <SortIcon field="created_at" />
                      </div>
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-black/60'
                      }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedQRCodes.map((qr, index) => {
                    const isDynamic = qr.settings?.isDynamic || false;
                    const isEditing = editingNameId === qr.id;

                    return (
                      <tr
                        key={qr.id}
                        className={`group border-b transition-colors ${isDark
                          ? 'border-white/5 hover:bg-white/5'
                          : 'border-black/5 hover:bg-black/5'
                          } ${index === sortedQRCodes.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <td className={`px-6 py-4 font-semibold ${isDark ? 'text-white' : 'text-black'
                          }`}>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveRename(qr.id);
                                  } else if (e.key === 'Escape') {
                                    handleCancelRename();
                                  }
                                }}
                                className={`px-3 py-1 rounded-lg border-2 ${isDark
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-white border-black/20 text-black'
                                  } focus:outline-none focus:border-blue-600`}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRename(qr.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 transition-all"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelRename}
                                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-500 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{qr.name}</span>
                              <button
                                onClick={() => handleStartRename(qr)}
                                className={`opacity-40 hover:opacity-100 transition-opacity p-1 rounded ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                                  }`}
                                title="Rename"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isDynamic ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-green-100 text-green-700 border border-green-300'
                              }`}>
                              Dynamic
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark
                              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}>
                              Static
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-4 ${isDark ? 'text-white/60' : 'text-black/60'
                          }`}>
                          <div className="max-w-md truncate" title={qr.url}>
                            {qr.url}
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-white/60' : 'text-black/60'
                          }`}>
                          {new Date(qr.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button
                              onClick={() => handleEdit(qr)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-xs hover:bg-blue-500 transition-all flex items-center gap-2"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(qr.id)}
                              disabled={deletingId === qr.id || confirmingDeleteId === qr.id}
                              className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-xs hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {deletingId === qr.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <TrashIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-current border-opacity-5 text-center">
        <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'opacity-30' : 'opacity-30'}`}>
          © 2025 NovaQR Studio • Professional Edition
        </p>
      </footer>

      {/* Delete Confirmation Modal */}
      {confirmingDeleteId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleDeleteCancel}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className={`relative z-10 p-6 rounded-2xl shadow-2xl border max-w-md w-full animate-in zoom-in-95 duration-200 ${isDark
              ? 'bg-gray-900 border-white/20'
              : 'bg-white border-black/10'
              }`}
            onClick={(e) => e.stopPropagation()}
            ref={deleteConfirmRef}
          >
            <p className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-black'
              }`}>
              Delete QR Code?
            </p>
            <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-black/60'
              }`}>
              This action cannot be undone. The QR code will be permanently deleted.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const qr = qrCodes.find(q => q.id === confirmingDeleteId);
                  if (qr) handleDeleteConfirm(qr.id);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-500 transition-all"
              >
                Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-black/5 text-black hover:bg-black/10'
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
