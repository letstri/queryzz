import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: './src/native/index.ts',
      outDir: './dist',
    },
    {
      input: './src/react/index.ts',
      outDir: './dist/react',
    },
  ],
  declaration: 'compatible',
  externals: ['react'],
})
