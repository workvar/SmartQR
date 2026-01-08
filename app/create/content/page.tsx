
'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { StepContent } from '@/components/steps/StepContent';
import { useEffect, useState } from 'react';
import { getDynamicQRQuota } from '@/app/actions';

export default function ContentPage() {
    const settings = useAppSelector((state: any) => state.qrSettings);
    const dispatch = useAppDispatch();
    const isDark = settings.theme === 'dark';
    const [isEditing, setIsEditing] = useState(false);
    const [isDynamic, setIsDynamic] = useState(false);
    const [dynamicQRQuota, setDynamicQRQuota] = useState<{ count: number; limit: number; canCreate: boolean } | null>(null);

    useEffect(() => {
        // Check if we're editing an existing QR code
        if (typeof window !== 'undefined') {
            const editingQR = sessionStorage.getItem('editingQR');
            if (editingQR) {
                try {
                    const parsed = JSON.parse(editingQR);
                    setIsEditing(true);
                    setIsDynamic(parsed.settings?.isDynamic || false);
                } catch (e) {
                    console.error('Error parsing editing QR:', e);
                }
            }
        }

        // Load dynamic QR quota
        loadDynamicQRQuota();
    }, []);

    const loadDynamicQRQuota = async () => {
        try {
            const data = await getDynamicQRQuota();
            setDynamicQRQuota(data);
        } catch (error) {
            console.error('Error loading dynamic QR quota:', error);
        }
    };

    const handleUpdate = (updates: Partial<typeof settings>) => {
        dispatch(updateSettings(updates));
    };

    return (
        <StepContent
            settings={settings}
            onUpdate={handleUpdate}
            isDark={isDark}
            isEditing={isEditing}
            isDynamic={isDynamic}
            dynamicQRQuota={dynamicQRQuota}
        />
    );
}
