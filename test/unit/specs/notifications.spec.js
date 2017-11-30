import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'
// import localforage from 'localforage'
// import axios from 'axios'

import Notifications from '../../../src/store/modules/notifications'

describe('Noitifications Store Module', () => {
    describe('Initial State', () => {
        it('should have an empty user state', () => {
            expect(typeof Notifications.state.notifications).toEqual('object')
            expect(Notifications.state.notifications).toEqual([])
        })

        it('should start in a loading state', () => {
            expect(typeof Notifications.state.show).toEqual('boolean')
            expect(Notifications.state.show).toEqual(false)
        })
    })

    describe('Mutators', () => {
        let $store

        beforeEach(() => {
            Vue.use(Vuex)
            $store = new Vuex.Store(_.cloneDeep(Notifications))
        })

        it('should show and hide sidebar', () => {
            $store.commit('TOGGLE_SHOW')
            expect($store.state.show).toEqual(true)
            $store.commit('TOGGLE_SHOW')
            expect($store.state.show).toEqual(false)
        })

        it('should update the notifications array', () => {
            const notificationArray = [{ id: 1, name: 'test' }]
            $store.commit('UPDATE_NOTIFICATIONS', notificationArray)
            expect($store.state.notifications).toEqual(notificationArray)
        })

        it('should update meta', () => {
            const meta = { total: 0, current_page: 1, per_page: 15 }
            $store.commit('UPDATE_META', meta)
            expect($store.state.meta).toEqual(meta)
        })
    })

    describe('Actions', () => {
        const data = [
            { id: 1, name: 'test' },
        ]
        let $store
        let mock = jest.fn()


        beforeEach(() => {
            Vue.use(Vuex)
            $store = new Vuex.Store(_.cloneDeep(Notifications))
            mock = jest.fn(() => Promise.resolve({
                body: {
                    data,
                    meta: {
                        pagination: { total: 20, current_page: 1, per_page: 15 },
                    },
                },
            }))
            Vue.http = {
                get: mock,
            }
        })

        describe('toggle', () => {
            it('should toggle notifications sidebar', () => {
                expect.assertions(1)
                $store.dispatch('toggle')
                Vue.nextTick(() => {
                    expect($store.state.show).toBe(true)
                })
            })
        })

        describe('increment counter', () => {
            it('should increment counter', () => {
                $store.dispatch('increaseMessageCount')
                expect($store.state.meta.total).toBe(1)
            })
        })

        describe('mark as read', () => {
            it('should mark notifications as read', () => {
                expect.assertions(4)
                $store.dispatch('updateNotifications', data)
                const post = jest.fn(() => Promise.resolve())
                mock = jest.fn(() => Promise.resolve({
                    body: {
                        data: [],
                        meta: {
                            pagination: { total: 0, current_page: 0, per_page: 15 },
                        },
                    },
                }))

                Vue.http = {
                    post,
                    get: mock,
                }

                $store.dispatch('markAllRead').then(() => {
                    expect(post).toBeCalled()
                    expect($store.state.notifications.length).toBe(0)
                    expect(Array.isArray($store.state.notifications)).toBe(true)
                    expect($store.state.notifications.map(n => n.id)).not.toContain(1)
                })
            })
        })

        describe('load notifications', () => {
            it('should update notifications', () => {
                expect.assertions(3)
                $store.dispatch('updateNotifications', data)
                Vue.nextTick(() => {
                    expect($store.state.notifications.length).toBe(1)
                    expect(Array.isArray($store.state.notifications)).toBe(true)
                    expect($store.state.notifications.map(n => n.id)).toContain(1)
                })
            })

            it('should load notifications from API', () => {
                expect.assertions(4)

                $store.dispatch('load').then(() => {
                    expect(mock).toBeCalled()
                    expect($store.state.notifications.length).toBe(1)
                    expect(Array.isArray($store.state.notifications)).toBe(true)
                    expect($store.state.notifications.map(n => n.id)).toContain(1)
                })
            })

            it('should add new notification from WS', () => {
                expect.assertions(3)
                $store.dispatch('load').then(() => {
                    $store.dispatch('newMessage', { id: 2, name: 'another' })
                    expect($store.state.notifications.length).toBe(2)
                    expect(Array.isArray($store.state.notifications)).toBe(true)
                    expect($store.state.notifications.map(n => n.id)).toEqual([2, 1])
                })
            })

            it('should load more notifications', () => {
                expect.assertions(5)

                $store.dispatch('load').then(() => {
                    mock = jest.fn(() => Promise.resolve({
                        body: {
                            data: [
                                { id: 2, name: 'another' },
                            ],
                            meta: {
                                pagination: { total: 20, current_page: 2, per_page: 15 },
                            },
                        },
                    }))

                    Vue.http = {
                        get: mock,
                    }

                    $store.dispatch('loadMore').then(() => {
                        expect(mock).toBeCalled()
                        expect(mock.mock.calls[0][1].params.page).toBe(2)
                        expect($store.state.notifications.length).toBe(2)
                        expect(Array.isArray($store.state.notifications)).toBe(true)
                        expect($store.state.notifications.map(n => n.id)).toEqual([1, 2])
                    })
                })
            })
        })
    })
})
