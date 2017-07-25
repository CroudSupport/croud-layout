import Vue from 'vue'
import jwtDecode from 'jwt-decode'
import localforage from 'localforage'
import { rootStore } from '../localForage'

export default {
    state: {
        user: {},
        rootUser: {},
        permissions: [],
        userSwitches: [],
        jwt: localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : {},
        root: localStorage.getItem('root') ? jwtDecode(localStorage.getItem('root')) : {},
        loading: true,
    },
    mutations: {
        UPDATE_USER(state, newState) {
            state.user = newState
        },
        UPDATE_ROOT_USER(state, newState) {
            state.rootUser = newState
        },
        UPDATE_PERMISSIONS(state, newState) {
            state.permissions = newState
        },
        UPDATE_USER_SWITCHES(state, newState) {
            state.userSwitches = newState
        },
        UPDATE_JWT(state) {
            state.jwt = jwtDecode(localStorage.getItem('jwt'))
        },
        UPDATE_ROOT(state) {
            state.root = jwtDecode(localStorage.getItem('root'))
        },
        STOP_LOADING(state) {
            state.loading = false
        },
    },
    actions: {
        updateUser: (context, state) => {
            Vue.localForage.setItem('updateUser', state)
            context.commit('UPDATE_USER', state)
        },
        updateRootUser: (context, state) => {
            context.commit('UPDATE_ROOT_USER', state)
        },
        updatePermissions: (context, state) => {
            Vue.localForage.setItem('updatePermissions', state)
            context.commit('UPDATE_PERMISSIONS', state)
        },
        updateUserSwitches: (context, state) => {
            Vue.localForage.setItem('updateUserSwitches', state)
            context.commit('UPDATE_USER_SWITCHES', state)
        },
        updateRoot: (context) => {
            context.commit('UPDATE_ROOT')
        },
        updateJWT: (context) => {
            context.commit('UPDATE_JWT')

            const jwt = localStorage.getItem('jwt')
            Vue.prototype.$http.defaults.headers.common.Authorization = `Bearer ${jwt}`
            Vue.http.defaults.headers.common.Authorization = `Bearer ${jwt}`
            Vue.localForage = localforage.createInstance({
                name: jwtDecode(jwt).sub,
            })

            return context.dispatch('auth')
        },

        auth: context => Vue.http.get('api/user/authorised').then((response) => {
            response.body.data.user.data.avatar = response.body.data.user.data.avatar_url
            context.dispatch('updateUser', response.body.data.user.data)
            context.dispatch('updatePermissions', response.body.data.permissions.data)

            if (context.getters.root.sub === context.getters.jwt.sub) {
                context.dispatch('updateUserSwitches', response.body.data.user_switches.data)
            }

            context.commit('STOP_LOADING')
        }).catch(() => {
            context.dispatch('updateUser', {})
            context.commit('STOP_LOADING')
        }),

        $init: (context) => {
            if (!localStorage.getItem('jwt')) {
                context.commit('STOP_LOADING')
                return
            }

            Vue.localForage.getItem('updateUser').then((data) => {
                if (data) {
                    context.commit('UPDATE_USER', data)
                    context.commit('STOP_LOADING')
                }

                if (!context.getters.root.sub) context.commit('UPDATE_ROOT_USER', data)
            })

            Vue.localForage.getItem('updatePermissions').then((data) => {
                if (data) context.commit('UPDATE_PERMISSIONS', data)
            })

            if (!context.getters.root.sub) {
                Vue.localForage.getItem('updateUserSwitches').then((data) => {
                    if (data) context.commit('UPDATE_USER_SWITCHES', data)
                })
            } else if (context.getters.root.sub !== context.getters.jwt.sub) {
                rootStore.getItem('updateUserSwitches').then((data) => {
                    if (data) context.commit('UPDATE_USER_SWITCHES', data)
                })
                rootStore.getItem('updateUser').then((data) => {
                    if (data) context.commit('UPDATE_ROOT_USER', data)
                    context.commit('STOP_LOADING')
                })
            }
        },
    },
    getters: {
        user: state => state.user,
        rootUser: state => state.rootUser,
        clients: (state) => {
            if (!state.user.allTeamClients) return []
            return state.user.allTeamClients.data
        },
        permissions: state => state.permissions,
        userSwitches: state => state.userSwitches,
        jwt: state => state.jwt,
        root: state => state.root,
        loading: state => state.loading,
        effectivePermissions: (state) => {
            if (!state.permissions.global || !state.permissions.global.effective_permissions) return []
            return state.permissions.global.effective_permissions
        },
    },

    namespaced: true,
}
