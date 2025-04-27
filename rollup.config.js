import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react']
    }),
    terser()
  ],
  external: ['react', 'react-dom', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
};