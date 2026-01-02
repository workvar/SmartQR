
'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { StepBranding } from '@/components/steps/StepBranding';

export default function BrandingPage() {
    const settings = useAppSelector((state: any) => state.qrSettings);
    const dispatch = useAppDispatch();
    const isDark = settings.theme === 'dark';

    const handleUpdate = (updates: Partial<typeof settings>) => {
        dispatch(updateSettings(updates));
    };

    return (
        <StepBranding
            settings={settings}
            onUpdate={handleUpdate}
            isDark={isDark}
        />
    );
}
