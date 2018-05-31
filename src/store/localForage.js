import Vue from 'vue'
import localforage from 'localforage'
import jwtDecode from './jwtSafeDecode'

const jwt = localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : {}
const rootJwt = localStorage.getItem('root') ? jwtDecode(localStorage.getItem('root')) : {}

const current = localforage.createInstance({
    name: jwt.sub,
})

export const rootStore = localforage.createInstance({
    name: rootJwt.sub,
})

Vue.localForage = current

export default current
