import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/queryzz.ts'),
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/queryzz.ts'),
      name: 'queryzz',
      fileName: 'queryzz',
    },
  },
  plugins: [dts({ entryRoot: './src', copyDtsFiles: true, tsconfigPath: './tsconfig.json' })],
});
