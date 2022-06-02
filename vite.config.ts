import { defineConfig } from 'vite'
import { join } from 'path'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const production = process.env.NODE_ENV === 'production'
const resolve = (dir: string) => join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  build: {
    target: 'es2015',
    terserOptions: {
      compress: {
        drop_console: true, // 所有console
        // pure_funcs: ['console.log'], // 单独指定
        drop_debugger: true,
      },
    },
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    /* 如需分包时开启 */
    /*
    rollupOptions: {
      output: {
        // 方式-1:所有依赖都分包
        // manualChunks(id) {
        //   if (id.includes('node_modules'))
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
        // },
        // 方式-2:只对大的依赖分包
        manualChunks: {
          vant: ['vant'], // 要分包的依赖
        },
      },
    }, */
  },
  plugins: [
    react(),
    !production &&
      nodePolyfills({
        include: [
          'node_modules/**/*.js',
          new RegExp('node_modules/.vite/.*js'),
        ],
      }),
  ],
})
