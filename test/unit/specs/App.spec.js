import Vue from 'vue'
import Vuex from 'vuex'

// import _ from 'lodash'
import localforage from 'localforage'
import localstorage from 'localstorage'
// import axios from 'axios'

import App from '../../../src/App'
import Store from '../../../src/store'

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVlNjE0OWQyMjgzYzBhZmEwOWJiZDJiYzE3ZDA2ZDk1ODRjZDcxN2E5M2QwNjhiYTU0NmIyNGI3ODE3MDI2NTY1MjBjYjZiYjFkMTk1MmVlIn0.eyJhdWQiOiJnYXRld2F5LWlyZWxhbmQiLCJqdGkiOiI1ZTYxNDlkMjI4M2MwYWZhMDliYmQyYmMxN2QwNmQ5NTg0Y2Q3MTdhOTNkMDY4YmE1NDZiMjRiNzgxNzAyNjU2NTIwY2I2YmIxZDE5NTJlZSIsImlhdCI6MTUwMDk3NDMwNSwibmJmIjoxNTAwOTc0MzA1LCJleHAiOjE1MDEyMzM1MDUsInN1YiI6IjIxMTciLCJzY29wZXMiOltdfQ.SGcw02bTra8PkAY1k3jbTWWh6kQwxP9CxnOU8wVzyXbVeevSZ9DomHMmMTBKTBajhNOvsrdFqROJj8nAO4NLqoroNAsK8syS1ytKHDmzFtOjDLxx4rEnJgs8jANVPeFAd8EMSD96I6Rqt0v0BmohjJp5H7WXGvvO8MdPsPSVPTW2OVaLjIXM6b8Ra-X0CV-zyeh48ynYQ_dXdIXssZM8s0i-iuDfQPcZwE8j4Yenq-Omm6tkf2ScG5AzS_3M61svsU09wXpBPvsvXsEFOF74Cjy1Sli0hUg90Bz9bX1uW983Dl3VDcsVqBfufR8fqJwjxmSotZUN8pKLUlXoTYD7LHj3UKluZlVDXMHd_J8l659X5M8tH18jIU3E26vz96LaosGJ6yB4aKQsKQAySrEHiB4F_PJOBi09hh1jLvPOi6e_XCdSieml3hZiGid8zEoR77yxxQsBHGY4YAda5Fb93mKy8ckCKbCjXybahrGleq1GI28f3ZwuW_RdhgjMuLIE6zE8mZrbZXNB8dvO7zfgPq1ty07gvU0Tbmf4Kggtr7E3_xKUOBFS2etcjUHDGloS_ql7pEiu3OwF4uCU1pdCA14pJz41EiW_gYfy5VDykMukRkYqJn2AddNmL4dKVUmeB7oo79W73TUSt7SwC05LSPCRtID-kQ7vQyCvG3MwQw4'

describe('App.vue', () => {
    let $vm

    beforeEach(() => {
        Vue.use(Vuex)
        Vue.use(localstorage)
        $vm = new Vue({
            components: {
                App,
            },
            store: Store,
            render: h => h(App),
        }).$mount()
    })

    test('should bounce to login page if no JWT exists', () => {
        expect($vm.$el).toMatchSnapshot()
        expect(typeof $vm).toBe('object')
    })

    test('should carry on loading with jwt but no cached data', async () => {
        localStorage.setItem('jwt', jwt)
        $vm.$store.commit('universal/UPDATE_JWT')

        await $vm.$store.dispatch('universal/$init').then(() => {
            expect($vm.$el).toMatchSnapshot()
        })
    })

    describe('Cached data + jwt', () => {
        test('Full temnplate', async () => {
            Vue.localForage = localforage.createInstance({ name: 'test' })
            Vue.localForage.setItem('updateUser', { id: 'test' })

            localStorage.setItem('jwt', jwt)
            $vm.$store.commit('universal/UPDATE_JWT')

            await $vm.$store.dispatch('universal/$init').then(() => {
                expect($vm.$el).toMatchSnapshot()
                Vue.localForage.removeItem('updateUser')
            })
        })

        test('empty template', async () => {
            $vm = new Vue({
                components: {
                    App,
                },
                store: Store,
                render: h => h(App, {
                    props: {
                        suppressTopbar: true,
                        suppressNav: true,
                    },
                }),
            }).$mount()

            Vue.localForage = localforage.createInstance({ name: 'test' })
            Vue.localForage.setItem('updateUser', { id: 'test' })

            localStorage.setItem('jwt', jwt)
            $vm.$store.commit('universal/UPDATE_JWT')

            await $vm.$store.dispatch('universal/$init').then(() => {
                expect($vm.$el).toMatchSnapshot()
                Vue.localForage.removeItem('updateUser')
            })
        })

        test('custom layout', async () => {
            $vm = new Vue({
                components: {
                    App,
                },
                store: Store,
                render: h => h(App, {
                    props: {
                        suppressTopbar: true,
                        suppressNav: true,
                    },
                }, [
                    h('div', {
                        slot: 'custom-layout',
                    }, 'this is a test'),
                ]),
            }).$mount()

            Vue.localForage = localforage.createInstance({ name: 'test' })
            Vue.localForage.setItem('updateUser', { id: 'test' })

            localStorage.setItem('jwt', jwt)
            $vm.$store.commit('universal/UPDATE_JWT')

            await $vm.$store.dispatch('universal/$init').then(() => {
                expect($vm.$el).toMatchSnapshot()
                Vue.localForage.removeItem('updateUser')
            })
        })
    })
})
