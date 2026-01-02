'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { QRCode } from '@/lib/supabase/types';
import { getUserData, getUserQRCodes, deleteQRCode } from '@/app/actions';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ qr_count: number; ai_suggestions_used: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
      loadQRCodes();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    setDeletingId(id);
    try {
      const result = await deleteQRCode(id);

      if (!result.success) {
        alert(result.error || 'Failed to delete QR code');
      } else {
        setQrCodes(qrCodes.filter(qr => qr.id !== id));
        // Reload user data to get updated count
        const updatedData = await getUserData();
        if (updatedData) {
          setUserData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (qr: QRCode) => {
    // Store QR settings in sessionStorage and navigate to create flow
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editingQR', JSON.stringify({
        id: qr.id,
        settings: qr.settings,
        name: qr.name,
      }));
    }
    router.push('/create/content');
  };

  const canCreateNew = userData ? userData.qr_count < 4 : true;
  const remainingQRs = userData ? Math.max(0, 4 - userData.qr_count) : 4;
  const remainingAISuggestions = userData ? Math.max(0, 2 - userData.ai_suggestions_used) : 2;

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold text-[#201f1e] dark:text-[#ffffff] mb-2">
                My QR Codes
              </h1>
              <p className="text-lg text-[#605e5c] dark:text-[#c8c6c4]">
                Manage and create your QR codes
              </p>
            </div>
            <Link
              href="/create/content"
              className={`px-6 py-3 rounded-md font-semibold text-base transition-all flex items-center gap-2 ${
                canCreateNew
                  ? 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e] shadow-md hover:shadow-lg'
                  : 'bg-[#c8c6c4] text-[#605e5c] cursor-not-allowed'
              }`}
            >
              <PlusIcon className="w-5 h-5" />
              Create New
            </Link>
          </div>

          {/* Limits Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-lg border ${
              canCreateNew
                ? 'bg-[#deecf9] dark:bg-[#0078d4]/10 border-[#0078d4]/20'
                : 'bg-[#fef6e6] dark:bg-[#ffaa44]/10 border-[#ffaa44]/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605e5c] dark:text-[#c8c6c4] mb-1">
                    QR Codes Created
                  </p>
                  <p className="text-2xl font-semibold text-[#201f1e] dark:text-[#ffffff]">
                    {userData?.qr_count || 0} / 4
                  </p>
                </div>
                {!canCreateNew && (
                  <ExclamationTriangleIcon className="w-6 h-6 text-[#ffaa44]" />
                )}
              </div>
              {canCreateNew && (
                <p className="text-sm text-[#605e5c] dark:text-[#c8c6c4] mt-2">
                  {remainingQRs} QR code{remainingQRs !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-[#deecf9] dark:bg-[#0078d4]/10 border-[#0078d4]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605e5c] dark:text-[#c8c6c4] mb-1">
                    AI Suggestions Used
                  </p>
                  <p className="text-2xl font-semibold text-[#201f1e] dark:text-[#ffffff]">
                    {userData?.ai_suggestions_used || 0} / 2
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#605e5c] dark:text-[#c8c6c4] mt-2">
                {remainingAISuggestions} suggestion{remainingAISuggestions !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        </div>

        {/* QR Codes Grid */}
        {qrCodes.length === 0 ? (
          <div className="text-center py-20">
            <QrCodeIcon className="w-16 h-16 mx-auto text-[#c8c6c4] dark:text-[#605e5c] mb-4" />
            <h3 className="text-xl font-semibold text-[#201f1e] dark:text-[#ffffff] mb-2">
              No QR codes yet
            </h3>
            <p className="text-[#605e5c] dark:text-[#c8c6c4] mb-6">
              Create your first QR code to get started
            </p>
            <Link
              href="/create/content"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0078d4] text-white rounded-md font-semibold hover:bg-[#106ebe] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First QR Code
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="bg-white dark:bg-[#252423] rounded-lg border border-[#edebe9] dark:border-[#3a3a3a] p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#201f1e] dark:text-[#ffffff] mb-2">
                    {qr.name}
                  </h3>
                  <p className="text-sm text-[#605e5c] dark:text-[#c8c6c4] truncate">
                    {qr.url}
                  </p>
                  <p className="text-xs text-[#8a8886] dark:text-[#8a8886] mt-2">
                    Created {new Date(qr.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(qr)}
                    className="flex-1 px-4 py-2 bg-[#0078d4] text-white rounded-md font-medium text-sm hover:bg-[#106ebe] transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(qr.id)}
                    disabled={deletingId === qr.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingId === qr.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

