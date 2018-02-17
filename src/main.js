// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSemantic from 'croud-vue-semantic'
import VueMoment from 'vue-moment'
import VueEcho from 'vue-echo'
import VueI18n from 'vue-i18n'

import App from './App'
import store from './store'
import axios from './axios'
import messages from './il8n'

import '../semantic/dist/semantic.min'
import '../semantic/dist/semantic.min.css'

window.io = require('socket.io-client')

Vue.config.productionTip = false
Vue.use(VueSemantic)
Vue.use(VueMoment)
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'en',
    messages,
})

/* eslint-disable no-new */
new Vue({
    i18n,
    el: '#app',
    template: '<App/>',
    components: { App },
    store,
    created() {
        Vue.use(axios, { setCroudDefaults: true })
        Vue.use(VueEcho, {
            broadcaster: 'socket.io',
            host: `${node_gateway_url.includes('https://') ? '' : '//'}${node_gateway_url}`,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        })
    },
})
