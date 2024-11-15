import { defineConfig, Options } from 'tsup';

const packageOptions: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  dts: true,
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom'],
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
};

export default defineConfig([
  {
    ...packageOptions,
    entry: {
      index: 'src/index.ts',
    },
    injectStyle: true,
    banner: {
      js: "'use client'",
    },
  },
  {
    ...packageOptions,
    entry: {
      index: 'src/blocks.ts',
    },
    outDir: 'dist/blocks',
  },
]);
