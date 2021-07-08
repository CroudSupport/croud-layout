import { Machine } from 'xstate'

export default Machine({
    id: 'universal',
    initial: 'loading',
    states: {
        loading: {
            on: {
                LOGOUT: 'login',
                SHOW_APP: 'app',
            },
        },
        login: {
            on: {
                LOGIN: 'app',
            },
        },
        app: {
            on: {
                LOGOUT: 'login',
            },
        },
    },
})
