import Vue from 'vue'
import Vuex from 'vuex'
import universal from './modules/universal'
import notifications from './modules/notifications'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        universal,
        notifications,
    },
    plugins: [
        /* eslint-disable no-underscore-dangle */
        store => Object.keys(store._actions).filter(a => a.includes('$init')).forEach(a => store.dispatch(a, a)),
    ],
})
