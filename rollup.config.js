import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/lib/index.ts',
  input: [
    {
      name: 'x6-react',
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript({ declaration: false }),
    resolve(),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
    filesize(),
  ]
}
