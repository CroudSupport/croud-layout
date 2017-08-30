// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import axios from './axios'

import '../semantic/dist/semantic.min'
import '../semantic/dist/semantic.min.css'

Vue.config.productionTip = false
Vue.use(require('croud-vue-semantic'))

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    store,
    created() {
        Vue.use(axios, { setCroudDefaults: true })
    },
})
