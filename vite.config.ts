import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      'import.meta.env.STORAGE': JSON.stringify(process.env.STORAGE || 'in-memory'),
    },
  };
});
