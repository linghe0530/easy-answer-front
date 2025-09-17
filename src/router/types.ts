import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        hideInMenu?: boolean
        access?: string
    }
}
