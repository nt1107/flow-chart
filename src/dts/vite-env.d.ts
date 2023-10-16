/// <reference types="vite/client" />
//上面这一行不能去掉！！它会引入一些东西？？

//https://github.com/element-plus/element-plus/issues/12834
declare module 'element-plus/dist/locale/zh-cn.mjs';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue';
  const Component: ComponentOptions;
  export default Component;
}

declare module 'bettersearch';
