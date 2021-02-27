export { default as Header } from '../../components/Header.vue'
export { default as ItemOrders } from '../../components/ItemOrders.vue'
export { default as Logo } from '../../components/Logo.vue'
export { default as Menu } from '../../components/Menu.vue'
export { default as VuetifyLogo } from '../../components/VuetifyLogo.vue'

export const LazyHeader = import('../../components/Header.vue' /* webpackChunkName: "components/Header" */).then(c => c.default || c)
export const LazyItemOrders = import('../../components/ItemOrders.vue' /* webpackChunkName: "components/ItemOrders" */).then(c => c.default || c)
export const LazyLogo = import('../../components/Logo.vue' /* webpackChunkName: "components/Logo" */).then(c => c.default || c)
export const LazyMenu = import('../../components/Menu.vue' /* webpackChunkName: "components/Menu" */).then(c => c.default || c)
export const LazyVuetifyLogo = import('../../components/VuetifyLogo.vue' /* webpackChunkName: "components/VuetifyLogo" */).then(c => c.default || c)
