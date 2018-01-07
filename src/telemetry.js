import Vue from 'vue'
import { Subject } from 'rxjs'
import jwtDecode from 'jwt-decode'

export const telemetryStream = new Subject()

export function observeResourcePerformance() {
    const performanceObserver = new window.PerformanceObserver((list) => {
        list.getEntriesByType('resource')
            .filter(e => e.initiatorType === 'xmlhttprequest')
            .filter(e => e.name.includes('//gateway.'))
            .forEach(resource => telemetryStream.next({ type: 'resource', ...resource.toJSON() }))
    })

    performanceObserver.observe({ entryTypes: ['resource'] })
}

export function observeErrors() {
    window.onerror = (...event) => { telemetryStream.next({ type: 'error', ...event }) }
    Vue.config.errorHandler = (...args) => {
        telemetryStream.next({ type: 'error', ...args })
    }
}

export function observeAxiosErrors(instance) {
    instance.interceptors.response.use(response => response, (error) => {
        telemetryStream.next({ type: 'axios-error', ...error.response })
        return Promise.reject(error)
    })
}

export default {
    install() {
        observeResourcePerformance()
        // observeErrors()
        // observeAxiosErrors(Vue.http)

        const socket = window.io('http://192.168.99.100:3030', {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                },
            },
        })

        telemetryStream.subscribe((event) => {
            const token = jwtDecode(localStorage.getItem('jwt'))
            socket.emit('telemetry', {
                ...event,
                user_id: token.sub,
                connection: {
                    downlink: navigator.connection.downlink,
                    effectiveType: navigator.connection.effectiveType,
                    rtt: navigator.connection.rtt,
                },
            })
        })
    },
}
