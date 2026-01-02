
'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { StepDesign } from '@/components/steps/StepDesign';

export default function DesignPage() {
    const settings = useAppSelector((state: any) => state.qrSettings);
    const dispatch = useAppDispatch();
    const isDark = settings.theme === 'dark';

    const handleUpdate = (updates: Partial<typeof settings>) => {
        dispatch(updateSettings(updates));
    };

    return (
        <StepDesign
            settings={settings}
            onUpdate={handleUpdate}
            isDark={isDark}
        />
    );
}
