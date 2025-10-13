import { defineConfig } from 'rollup'
import vue from 'rollup-plugin-vue'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'

import { readFileSync } from 'fs'
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))

export default defineConfig([
  // Main build
  {
    input: 'index.js',
    external: [
      'vue',
      '@tanstack/vue-query',
      'vue-good-table-next',
      '@vuepic/vue-datepicker',
      '@coreui/vue',
      '@coreui/icons-vue',
      'vue-i18n',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/vue-fontawesome',
      'date-fns'
    ],
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      vue({
        css: false,
        compileTemplate: true
      }),
      postcss({
        extract: true,
        minimize: true
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      })
    ]
  },
  // TypeScript definitions
  {
    input: 'index.d.ts',
    output: {
      file: packageJson.types,
      format: 'esm'
    },
    plugins: [dts()]
  }
])
