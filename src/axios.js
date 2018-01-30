import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import urlTemplate from 'url-template'

const actions = {
    get: { method: 'get' },
    save: { method: 'post' },
    query: { method: 'get' },
    update: { method: 'put' },
    remove: { method: 'delete' },
    delete: { method: 'delete' },
}


const buildRequest = (url, action, args) => {
    const local = action
    local.url = url.expand(args[0])

    if (args.length > 1) {
        local.data = args[1]
        local.body = args[1]
    } else {
        switch (action.method) {
        case 'post':
        case 'put':
            local.data = args[0]
            local.body = args[0]
            break

        default:
            local.params = args[0]
            break
        }
    }

    return local
}

export default {
    install(vue, options = {}) {
        if (options.setCroudDefaults) {
            axios.defaults.baseURL = `${gateway_url.includes('https://') ? '' : '//'}${gateway_url}`
            axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwt')}`
            axios.defaults.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'brackets' })
        }

        const instance = axios.create(options.defaults)
        const legacy = axios.create({
            baseURL: '/',
        })

        instance.interceptors.response.use((response) => {
            response.body = response.data
            return response
        })

        Vue.prototype.$http = instance
        Vue.prototype.$httpLegacy = legacy
        Vue.http = instance
        Vue.httpLegacy = legacy

        const resource = (url) => {
            const axiosResource = {}

            Object.keys(actions).forEach((alias) => {
                axiosResource[alias] = (...args) => instance.request(buildRequest(urlTemplate.parse(url), actions[alias], args))
            })

            return axiosResource
        }

        Vue.prototype.$resource = resource
        Vue.resource = resource
    },
}
