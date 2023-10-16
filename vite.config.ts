import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from 'vite-plugin-mock';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd());//获取.env里面的变量

  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        'cpns/': `${path.resolve(__dirname, 'src/components')}/`
      },
      // 使用路径别名时想要省略的后缀名，可以自己 增减
      extensions: ['.js', '.json', '.ts', '.vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/style/element.scss" as *;`
        }
      }
    },
    // server: {
    //   proxy: {
    //     // 使用 proxy 实例
    //     '/api': {
    //       target: 'https://precision-marketing.xyici.com',
    //       changeOrigin: true
    //       // rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        // 自定引入 Vue VueRouter API,如果还需要其他的可以自行引入
        imports: ['vue', 'vue-router'],
        // 调整自动引入的文件位置
        dts: 'src/dts/auto-imports.d.ts',
        // 解决自动引入eslint报错问题 需要在eslintrc的extend选项中引入
        eslintrc: {
          enabled: true,
          // 配置文件的位置
          filepath: 'src/dts/.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true,
            version: '2.1.5'
          })
        ],
        dts: 'src/dts/components.d.ts'
      }),
      //mock配置
      viteMockServe({
        mockPath: 'mock',
        enable: true
      }),
      // rollup-plugin-visualizer
      visualizer(),
      // gzip文件压缩
      viteCompression({
        ext: '.gz', // 生成文件的后缀名
        algorithm: 'gzip' // 默认为gzip
      }),
      // name 可以写在 script 标签上
      vueSetupExtend({})
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // echarts 独立打包优化
            echarts: ['echarts']
          }
        }
      }
    }
  };
});
