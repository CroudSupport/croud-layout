// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSemantic from 'croud-vue-semantic'
import VueMoment from 'vue-moment'
import VueEcho from 'vue-echo'

import App from './App'
import store from './store'
import axios from './axios'

import '../semantic/dist/semantic.min'
import '../semantic/dist/semantic.min.css'

window.io = require('socket.io-client')

Vue.config.productionTip = false
Vue.use(VueSemantic)
Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    store,
    created() {
        Vue.use(axios, { setCroudDefaults: true })
        Vue.use(VueEcho, {
            broadcaster: 'socket.io',
            host: `//${node_gateway_url}`,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        })
    },
})
