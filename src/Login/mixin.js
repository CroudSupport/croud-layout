import storage from 'localstorage'
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            password: '',
            reminderEmail: '',
            passwordSuccess: false,
            displayPassword: false,
            loading: false,
            errors: false,
            errorMessage: false,
            passwordError: false,
            remember: false,
            view: 'login',
            username: '',
            passwordSuccessMessage: 'If your account was found we have emailed you a password reset link.',
            generalError: 'Your email or password is incorrect. Please try again.',
            emailUs: 'For further assistance, Please email <a class="basic" href="mailto:support@croud.com">support@croud.com</a>.',
        }
    },

    computed: mapGetters({
        legacyAuth: 'universal/legacyAuth',
    }),

    watch: {
        view() {
            this.passwordError = false
            this.errorMessage = false
            this.passwordSuccess = false
        },

        displayPassword() {
            this.$nextTick(() => {
                this.focusPassword()
            })
        },

        errors(value) {
            if (!value) {
                this.errorMessage = false
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

        focusPassword() {
            this.$refs.password.focus()
        },

        animate(el, name, duration = 500) {
            el.classList.add(name)

            setTimeout(() => {
                el.classList.remove(name)
            }, duration)
        },

        showErrorMessage() {
            this.errorMessage = true
        },

        hideErrorMessage() {
            this.errorMessage = false
        },

        showPasswordErrorMessage() {
            this.passwordError = true
        },

        hidePasswordMessage() {
            this.errorMessage = false
            this.passwordSuccess = false
        },

        hidePasswordErrorMessage() {
            this.passwordError = false
        },

        emailResetSuccess() {
            this.loading = false
            this.passwordSuccess = true
            this.error = false
            this.passwordError = false
            this.reminderEmail = ''
        },

        check() {
            if (this.loading) return

            if (!this.username.length || !this.password.length) {
                this.animate(this.$refs.userCredFields, 'shake')
                return
            }

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
                    this.$httpLegacy.post('/authenticate/', {
                        authToken: response.data.jwt,
                    })
                }
            }, () => {
                this.loading = false
                this.errors = true
                this.animate(this.$refs.userCredFields, 'shake')
            })
        },

        submitPasswordLink() {
            if (!this.reminderEmail.length) {
                this.animate(this.$refs.reminderEmail, 'shake')
                return
            }
            this.loading = true
            this.$http.post(`//${gateway_url}/password/email`, {
                username: this.reminderEmail,
            }).then(() => {
                this.emailResetSuccess()
            }, () => {
                this.emailResetSuccess()
            })
        },

        socialAuth(provider) {
            this.loading = true
            window.addEventListener('message', (event) => {
                localStorage.setItem('jwt', event.data.access_token)
                if (this.legacyAuth) {
                    this.$httpLegacy.post('/authenticate/', {
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
