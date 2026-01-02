import { configureStore } from '@reduxjs/toolkit';
import qrSettingsReducer from './qrSettingsSlice';

export const store = configureStore({
  reducer: {
    qrSettings: qrSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

