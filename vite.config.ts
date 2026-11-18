import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/FMRD-DIS-EMMET-UI-Prototype/' : '/',
  plugins: [react()],
}));
