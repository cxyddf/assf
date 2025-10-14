/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}

declare module '@element-plus/icons-vue' {
  export const Search: any
  export const ArrowLeft: any
  export const Close: any
  export const Star: any
  export const Loading: any
  export const Refresh: any
}