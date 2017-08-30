jQuery(($) => {
    window.vue = window.vue || require('vue')
    window.vue_resource = window.vue_resource || require('vue-resource')

    const Vue = window.vue
    Vue.use((window.vue_resource))
    Vue.use(require('croud-vue-semantic'))
    Vue.use(require('vue-env'))

    const App = require('./App.vue')

    new Vue({

        components: { App },

        el: '#login-container',

        data: {},

        template: '<div id="login-container"><app>asddsaasd</app></div>',
    })
})
