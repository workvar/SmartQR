'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { QRCode } from '@/lib/supabase/types';
import { getUserData, getUserQRCodes, deleteQRCode, getDynamicQRQuota, renameQRCode } from '@/app/actions';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuotaCard } from '@/components/dashboard/QuotaCard';
import { QRTable } from '@/components/dashboard/QRTable';
import { DeleteModal } from '@/components/dashboard/DeleteModal';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { AppFooter } from '@/components/common/AppFooter';

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

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
      loadQRCodes();
      loadDynamicQRQuota();
    }
  }, [isLoaded, user]);

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
    // Don't allow deleting already deleted QR codes
    const qr = qrCodes.find(q => q.id === id);
    if (qr?.deleted_at) {
      return;
    }
    setConfirmingDeleteId(id);
  };

  const handleDeleteCancel = () => {
    setConfirmingDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmingDeleteId) return;
    const id = confirmingDeleteId;
    setConfirmingDeleteId(null);
    setDeletingId(id);
    try {
      const result = await deleteQRCode(id);

      if (!result.success) {
        alert(result.error || 'Failed to delete QR code');
      } else {
        // Reload QR codes to get updated list with deleted status
        loadQRCodes();
        loadDynamicQRQuota();
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (qr: QRCode) => {
    // Don't allow editing deleted QR codes
    if (qr.deleted_at) {
      return;
    }
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
    // Don't allow renaming deleted QR codes
    if (qr.deleted_at) {
      return;
    }
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

  if (!isLoaded || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-[#F5F5F7]'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out ${isDark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
      <DashboardHeader isDark={isDark} onToggleTheme={toggleTheme} showPricingLink={true} />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <QuotaCard
              title="QR Codes Usage"
              used={userData?.qr_count || 0}
              limit={4}
              remaining={remainingQRs}
              usedColor={isDark ? '#3b82f6' : '#2563eb'}
              remainingColor={isDark ? '#1e293b' : '#e2e8f0'}
              isDark={isDark}
              isWarning={!canCreateNew}
            />
            <QuotaCard
              title="AI Suggestions Usage"
              used={userData?.ai_suggestions_used || 0}
              limit={2}
              remaining={remainingAISuggestions}
              usedColor={isDark ? '#8b5cf6' : '#7c3aed'}
              remainingColor={isDark ? '#1e293b' : '#e2e8f0'}
              isDark={isDark}
            />
            <QuotaCard
              title="Dynamic QR Usage"
              used={dynamicQRQuota?.count || 0}
              limit={dynamicQRQuota?.limit || 1}
              remaining={remainingDynamicQRs}
              usedColor={isDark ? '#10b981' : '#059669'}
              remainingColor={isDark ? '#1e293b' : '#e2e8f0'}
              isDark={isDark}
            />
          </div>
        </div>

        {qrCodes.length === 0 ? (
          <EmptyState isDark={isDark} />
        ) : (
          <QRTable
            qrCodes={sortedQRCodes}
            isDark={isDark}
            sortField={sortField}
            sortDirection={sortDirection}
            editingNameId={editingNameId}
            editingName={editingName}
            deletingId={deletingId}
            onSort={handleSort}
            onStartRename={handleStartRename}
            onCancelRename={handleCancelRename}
            onSaveRename={handleSaveRename}
            onEdit={handleEdit}
            onDeleteClick={handleDeleteClick}
            onEditingNameChange={setEditingName}
          />
        )}
      </main>

      <AppFooter isDark={isDark} />

      <DeleteModal
        isOpen={!!confirmingDeleteId}
        isDark={isDark}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
