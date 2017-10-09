import storage from 'localstorage'
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            password: '',
            reminder_email: '',
            password_success: false,
            display_password: false,
            loading: false,
            errors: false,
            error_message: false,
            password_error: false,
            remember: false,
            view: 'login',
            username: '',
        }
    },

    computed: mapGetters({
        legacyAuth: 'universal/legacyAuth',
    }),

    watch: {
        view() {
            this.error_message = false
            this.password_error = false
    // this.password_success = false;
        },
        display_password() {
            this.$nextTick(() => {
                this.focusPassword()
            })
        },

        errors(value) {
            if (!value) {
                this.error_message = false
        // this.hideErrorMessage()
            } else {
                this.showErrorMessage()
            }
        },
    },

    transitions: {
        slider: {
            css: false,
            enter(el, done) {
                const $el = $(el)
                const speed = $el.data('speed') ? parseInt($el.data('speed'), 10) : 500

                const height = $el.height()

                $(el).css({ height: 0, opacity: 0 })
                    .animate({
                        height: height + 5,
                        opacity: 1,
                    }, speed, done)
            },
            enterCancelled(el) {
                $(el).stop()
            },
            leave(el, done) {
                const $el = $(el)
                const speed = $el.data('speed') ? parseInt($el.data('speed'), 10) / 2 : 250
                $(el).animate({ height: 0, opacity: 0 }, speed, done)
            },
            leaveCancelled(el) {
                $(el).stop()
            },
        },
    },

    methods: {
        ...mapActions({
            updateJWT: 'universal/updateJWT',
            updateRoot: 'universal/updateRoot',
        }),

        focusUsername() {
            this.$refs.username.focus()
        },

        display_password() {
            this.$nextTick(() => {
                this.focusPassword()
            })
        },

        focusPassword() {
            this.$refs.password.focus()
        },

        shake() {
            $('#form-fields-container').animateCss('shake')
        },

        showErrorMessage() {
            this.error_message = true
            this.$nextTick(() => {
                $('#error-message').animateCss('bounceInDown')
            })
        },

        hideErrorMessage() {
            $('#error-message').animateCss('fadeOutDown', () => {
                this.error_message = false
            })
            setTimeout(() => {
                this.error_message = false
            }, 400)
        },

        showPasswordErrorMessage() {
            this.password_error = true
            this.$nextTick(() => {
                $('#password_error').animateCss('bounceInDown')
            })
        },

        hidePasswordMessage() {
            $('#error-message').animateCss('fadeOutDown', () => {
                this.error_message = false
                this.password_success = false
            })
            setTimeout(() => {
                this.password_success = false
            }, 400)
        },

        hidePasswordErrorMessage() {
            $('#error-message').animateCss('fadeOutDown', () => {
                this.password_error = false
            })
            setTimeout(() => {
                this.password_error = false
            }, 400)
        },

        check() {
            if (this.loading) return

            this.errors = false
            this.loading = true

            const data = {
                username: this.username,
                password: this.password,
                remember: this.remember ? 'yes' : null,
            }

            this.$http.post('login', data).then((response) => {
                storage.delete(`main_navigation_${response.data.id}`)
                localStorage.setItem('jwt', response.data.jwt)
                localStorage.setItem('root', response.data.jwt)
                this.updateRoot()
                this.updateJWT()
                this.$emit('login')

                if (this.legacyAuth) {
                    this.$httpLegacy.post('/login/auth/', {
                        authToken: response.data.jwt,
                    })
                }
            }, () => {
                this.loading = false
                this.errors = true
                this.shake()
            })
        },

        submitPasswordLink() {
            if (this.reminder_email === '') return

            this.loading = true

            this.$http.post(`//${gateway_url}/password/email`, {
                username: this.reminder_email,
            }).then((response) => {
                this.loading = false
                this.password_success = response.data.success
                this.error = false // !response.data.success;
            }, () => {
                this.loading = false
                this.showPasswordErrorMessage() // true;
            })
        },

        socialAuth(provider) {
            this.loading = true
            window.addEventListener('message', (event) => {
                localStorage.setItem('jwt', event.data.access_token)
                if (this.legacyAuth) {
                    this.$httpLegacy.post('/login/auth/', {
                        authToken: event.data.access_token,
                    })
                }
            }, false)

            window.open(`//${gateway_url}/auth/${provider}`, '_blank')
        },

        forgotPassword() {
            this.view = 'forgot'
        },
    },
}
