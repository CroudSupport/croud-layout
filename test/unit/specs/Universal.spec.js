import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'
import localforage from 'localforage'
import axios from 'axios'

import Universal from '../../../src/store/modules/universal'

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVlNjE0OWQyMjgzYzBhZmEwOWJiZDJiYzE3ZDA2ZDk1ODRjZDcxN2E5M2QwNjhiYTU0NmIyNGI3ODE3MDI2NTY1MjBjYjZiYjFkMTk1MmVlIn0.eyJhdWQiOiJnYXRld2F5LWlyZWxhbmQiLCJqdGkiOiI1ZTYxNDlkMjI4M2MwYWZhMDliYmQyYmMxN2QwNmQ5NTg0Y2Q3MTdhOTNkMDY4YmE1NDZiMjRiNzgxNzAyNjU2NTIwY2I2YmIxZDE5NTJlZSIsImlhdCI6MTUwMDk3NDMwNSwibmJmIjoxNTAwOTc0MzA1LCJleHAiOjE1MDEyMzM1MDUsInN1YiI6IjIxMTciLCJzY29wZXMiOltdfQ.SGcw02bTra8PkAY1k3jbTWWh6kQwxP9CxnOU8wVzyXbVeevSZ9DomHMmMTBKTBajhNOvsrdFqROJj8nAO4NLqoroNAsK8syS1ytKHDmzFtOjDLxx4rEnJgs8jANVPeFAd8EMSD96I6Rqt0v0BmohjJp5H7WXGvvO8MdPsPSVPTW2OVaLjIXM6b8Ra-X0CV-zyeh48ynYQ_dXdIXssZM8s0i-iuDfQPcZwE8j4Yenq-Omm6tkf2ScG5AzS_3M61svsU09wXpBPvsvXsEFOF74Cjy1Sli0hUg90Bz9bX1uW983Dl3VDcsVqBfufR8fqJwjxmSotZUN8pKLUlXoTYD7LHj3UKluZlVDXMHd_J8l659X5M8tH18jIU3E26vz96LaosGJ6yB4aKQsKQAySrEHiB4F_PJOBi09hh1jLvPOi6e_XCdSieml3hZiGid8zEoR77yxxQsBHGY4YAda5Fb93mKy8ckCKbCjXybahrGleq1GI28f3ZwuW_RdhgjMuLIE6zE8mZrbZXNB8dvO7zfgPq1ty07gvU0Tbmf4Kggtr7E3_xKUOBFS2etcjUHDGloS_ql7pEiu3OwF4uCU1pdCA14pJz41EiW_gYfy5VDykMukRkYqJn2AddNmL4dKVUmeB7oo79W73TUSt7SwC05LSPCRtID-kQ7vQyCvG3MwQw4'

describe('Universal Store Module', () => {
    describe('Initial State', () => {
        it('should have an empty user state', () => {
            expect(typeof Universal.state.user).toEqual('object')
            expect(Universal.state.user).toEqual({})
        })

        it('should start in a loading state', () => {
            expect(typeof Universal.state.loading).toEqual('boolean')
            expect(Universal.state.loading).toEqual(true)
        })
    })

    describe('Mutators', () => {
        let $store

        beforeEach(() => {
            Vue.use(Vuex)
            $store = new Vuex.Store(_.cloneDeep(Universal))
        })

        it('should stop loading when STOP_LOADING mutation is called', () => {
            $store.commit('STOP_LOADING')
            expect($store.state.loading).toEqual(false)
        })

        it('should update the user object', () => {
            const user = { id: 1, name: 'test' }
            $store.commit('UPDATE_USER', user)
            expect($store.state.user).toEqual(user)
        })

        it('should update permissions', () => {
            const permissions = { effective: ['foo', 'bar'] }
            $store.commit('UPDATE_PERMISSIONS', permissions)
            expect($store.state.permissions).toEqual(permissions)
        })

        it('should update user switches', () => {
            const users = [{ id: 2, name: 'test 2' }]
            $store.commit('UPDATE_USER_SWITCHES', users)
            expect($store.state.userSwitches).toEqual(users)
        })

        it('should decode a jwt from local storage', () => {
            localStorage.setItem('jwt', jwt)
            $store.commit('UPDATE_JWT')
            expect($store.state.jwt.sub).toEqual('2117')
            localStorage.removeItem('jwt')
        })
    })

    describe('Actions', () => {
        let $store

        beforeEach(() => {
            Vue.use(Vuex)
            $store = new Vuex.Store(_.cloneDeep(Universal))
        })

        describe('auth', () => {
            it('should process successfull auth response', () => {
                expect.assertions(3)
                const user = { avatar_url: 'test' }
                const permissions = { effective: ['foo', 'bar'] }
                const userSwitches = [{ id: 2, name: 'test 2' }]

                Vue.http = {
                    get: jest.fn(() => Promise.resolve({
                        body: {
                            data: {
                                user: {
                                    data: user,
                                },
                                permissions: {
                                    data: permissions,
                                },
                                user_switches: {
                                    data: userSwitches,
                                },
                            },
                        },
                    })),
                }
                $store.dispatch('auth').then(() => {
                    expect($store.state.user).toBe(user)
                    expect($store.state.permissions).toBe(permissions)
                    expect($store.state.userSwitches).toBe(userSwitches)
                })
            })

            it('should handle bad auth call by removing user object', () => {
                expect.assertions(2)
                const user = { avatar_url: 'test' }
                $store.dispatch('updateUser', user)

                expect($store.state.user).toEqual(user)

                Vue.http = {
                    get: jest.fn(() => Promise.reject()),
                }
                $store.dispatch('auth').then(() => {
                    expect($store.state.user).toEqual({})
                })
            })
        })

        describe('$init', () => {
            it('should stop loading without jwt', () => {
                $store.dispatch('$init')
                expect($store.state.loading).toBe(false)
            })

            it('should keep loading with JWT but no user cache', () => {
                localStorage.setItem('jwt', jwt)
                $store.commit('UPDATE_JWT')

                $store.dispatch('$init')
                expect($store.state.loading).toBe(true)
            })

            it('should stop loading if user data is in the cache', async () => {
                expect.assertions(1)
                Vue.localForage = localforage.createInstance({ name: 'test' })

                Vue.localForage.setItem('updateUser', { name: 'test' })

                localStorage.setItem('jwt', jwt)
                $store.commit('UPDATE_JWT')

                await $store.dispatch('$init').then(() => {
                    expect($store.state.loading).toBe(false)
                })
            })
        })

        describe('updateJWT', () => {
            it('should switch to the correct localforage store', async () => {
                Vue.prototype.$http = axios
                Vue.http = axios

                Vue.localForage = localforage.createInstance({ name: 'test' })
                expect(Vue.localForage._config.name).toBe('test')

                localStorage.setItem('jwt', jwt)

                await $store.dispatch('updateJWT').then(() => {
                    expect(Vue.localForage._config.name).toBe('2117')
                })
            })
        })
    })
})
