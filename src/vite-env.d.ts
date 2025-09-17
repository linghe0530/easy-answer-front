/// <reference types="vite/client" />
interface ViteTypeOptions {
    strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
    readonly VITE_BACKEND_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.vue' {
    import { Component, DefineComponent } from 'vue'
    const component: DefineComponent<object, object, Component>
    export default component
}
