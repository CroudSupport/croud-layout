import Vue from 'vue'

export default {
    state: {
        notifications: [],
        meta: {
            total: 0,
            current_page: 0,
            per_page: 15,
        },
        show: false,
    },
    mutations: {
        UPDATE_NOTIFICATIONS(state, newState) {
            state.notifications = newState
        },
        UPDATE_META(state, newState) {
            state.meta = newState
        },
        TOGGLE_SHOW(state) {
            state.show = !state.show
        },
    },
    actions: {
        updateNotifications: (context, state) => context.commit('UPDATE_NOTIFICATIONS', state),
        toggle: context => context.commit('TOGGLE_SHOW'),
        load(context) {
            Vue.http.get('api/notification', {
                params: {
                    per_page: context.state.meta.per_page,
                },
            }).then((response) => {
                context.commit('UPDATE_NOTIFICATIONS', response.body.data)
                context.commit('UPDATE_META', response.body.meta.pagination)
            })
        },

        loadMore(context) {
            Vue.http.get('api/notification', {
                params: {
                    per_page: context.state.meta.per_page,
                    page: context.state.meta.current_page + 1,
                },
            }).then((response) => {
                context.commit('UPDATE_NOTIFICATIONS', [
                    ...context.state.notifications,
                    ...response.body.data,
                ])
                context.commit('UPDATE_META', response.body.meta.pagination)
            })
        },

        markAllRead(context) {
            Vue.http.post('api/notification/read-all').finally(() => {
                context.dispatch('load')
            })
        },

        newMessage(context, state) {
            context.dispatch('increaseMessageCount')
            context.commit('UPDATE_NOTIFICATIONS', [
                state,
                ...context.state.notifications,
            ])
        },

        increaseMessageCount(context) {
            context.commit('UPDATE_META', {
                ...context.state.meta,
                total: context.state.meta.total + 1,
            })
        },
    },
    getters: {
        all: state => state.notifications,
        count: state => state.meta.total,
        show: state => state.show,
        more: state => state.meta.total_pages > state.meta.current_page,
    },

    namespaced: true,
}
