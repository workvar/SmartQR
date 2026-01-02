import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QRSettings } from '../types';
import { DEFAULT_SETTINGS } from '../lib/defaults';

const initialState: QRSettings = DEFAULT_SETTINGS;

const qrSettingsSlice = createSlice({
  name: 'qrSettings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<QRSettings>>) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => {
      return DEFAULT_SETTINGS;
    },
  },
});

export const { updateSettings, resetSettings } = qrSettingsSlice.actions;
export default qrSettingsSlice.reducer;

