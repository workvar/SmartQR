
'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { StepContent } from '@/components/steps/StepContent';

export default function ContentPage() {
    const settings = useAppSelector((state: any) => state.qrSettings);
    const dispatch = useAppDispatch();
    const isDark = settings.theme === 'dark';

    const handleUpdate = (updates: Partial<typeof settings>) => {
        dispatch(updateSettings(updates));
    };

    return (
        <StepContent
            settings={settings}
            onUpdate={handleUpdate}
            isDark={isDark}
        />
    );
}
