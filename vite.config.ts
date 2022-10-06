import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mockPlugin from 'vite-plugin-file-mock';
import { VitePWA } from 'vite-plugin-pwa';
import htmlPlugin from 'vite-plugin-html-config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  const dist = env.VITE_SAFE_MODE ? 'dist_safe' : 'dist';
  return {
    plugins: [
      react(),
      mockPlugin(),
      htmlPlugin({
        favicon: 'logo.svg',
        metas: [
          {
            name: 'keywords',
            content: 'konachan image acg',
          },
        ],
      }),
      ...(env.VITE_PLATFORM === 'web'
        ? [
            VitePWA({
              includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
              manifest: {
                name: 'BetterKonachan',
                short_name: 'BetterKonachan',
                description: 'BetterKonachan',
                theme_color: '#ffffff',
                start_url: '/',
                icons: [
                  {
                    src: 'icon.jpg',
                    sizes: '512x512 192x192',
                    type: 'image/png',
                  },
                ],
              },
              registerType: 'autoUpdate',
              devOptions: {
                enabled: true,
              },
              strategies: 'injectManifest',
              srcDir: 'src',
              filename: 'sw.ts',
            }),
          ]
        : []),
    ],
    // 防止 vite 输出复杂的 rust 错误
    clearScreen: false,
    // Tauri 使用固定端口，若此端口不可用将会导致程序错误
    server: {
      strictPort: true,
      port: 1234,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // 使用 `TAURI_PLATFORM`、`TAURI_ARCH`、`TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`、`TAURI_PLATFORM_TYPE` 和 `TAURI_DEBUG` 环境变量
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      outDir: dist,
      // Tauri 支持 es2021
      target: ['es2021', 'chrome100', 'safari13'],
      // 不为调试构建压缩构建体积
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      // 为调试构建生成源代码映射 (sourcemap)
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  };
});
