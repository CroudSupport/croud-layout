import VueMoment from 'vue-moment'
import universal from './store/modules/universal'
import notifications from './store/modules/notifications'
import croudLayout from './App'

export default {
    install(Vue, options) {
        Vue.component('croud-layout', croudLayout)
        Vue.use(VueMoment)

        options.store.registerModule('universal', universal)
        options.store.registerModule('notifications', notifications)
        /* eslint-disable no-underscore-dangle */
        Object.keys(options.store._actions).filter(a => a.includes('$init')).forEach(a => options.store.dispatch(a, a))

        if (options.noLegacyAuth) {
            options.store.commit('universal/STOP_LEGACY_AUTH')
        }

        if (options.globalPermission) {
            options.store.commit('universal/SET_GLOBAL_PERMISSION_KEY', options.globalPermission)
        }

        Vue.nextTick(() => {
            /* eslint-disable */
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NLBX2QT');
            /* eslint-disable */
        })
    },
}
