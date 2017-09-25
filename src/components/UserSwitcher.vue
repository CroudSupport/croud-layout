<style scoped>

    .switcher {
        font-size:13px;
        text-align:right;
        display:block;
        position: absolute;
        height:40px;
        margin-top: 15px;
        right:10px;
    }

    .condensed .switcher {
        margin-top: 3px;
        right: 0;
    }

    .switcher * {
        vertical-align: middle;
    }

    .ui.dropdown .menu > .header {
        font-size: 1em;
    }

    .header .ui.avatar.image {
        margin-right: 1em;
        display: inline-block;
        width: 2em;
        height: 2em;
        border-radius: 500rem;
        font-size: 1.2em;
    }

    .switcher .item {
        padding-right: 40px !important;
        min-width: 280px
    }
    .switcher .scrolling .item {
        border-bottom: 1px solid rgba(34,36,38,.05);
    }

    .switcher .header {
        min-width: 280px;
        min-height:40px;
        padding-right: 0 !important;
    }

    .removeUser {
        position: absolute;
        z-index: 2;
        right: 10px;
        top: 16px;
        font-size: 1.4em;
        cursor: pointer;
        color: #c00
    }

    .item .label,
    .header .label {
        margin-top:10px;
        margin-left:35px;
        margin-right:130px;
        padding-top: 8px !important;
    }
    .item .label {
        margin-top:0;
        padding-top: 6px !important;
    }
    .item .avatar,
    .header .avatar{
        position:absolute;
    }

    .light {
        font-size:0.9em;
    }

    .logout {
        position: absolute;
        z-index: 2;
        right: 10px;
        top: 12px;
    }

</style>

<template>
    <div>
        <div class="switcher">
            <div v-if="showSwitcher" ref="userSwitcher" class="ui floating labeled icon top right pointing dropdown tiny positive button">
                <i class="exchange icon"></i>
                <span class="text">Switch</span>
                <div class="menu">
                    <button class="ui button tiny logout blue" @click.stop="logout">logout</button>
                    <div class="header">
                        <img class="ui avatar image" :src="current_user.avatar" :data-id="current_user.id">
                        <div class="label" v-html="current_user.name"></div>
                    </div>
                    <div class="divider"></div>
                    <!-- <div class="ui icon input">
                        <i class="search icon"></i>
                        <input type="text" placeholder="Search users...">
                    </div> -->
                    <div v-if="root_user.id != current_user.id" class="item">
                        <div :data-id="root_user.id">
                            <img class="ui avatar image" :src="root_user.avatar">
                            <div class="label" v-html="root_user.name"></div>
                        </div>
                    </div>
                    <div v-if="org_user && org_user.id != null && (org_user.id != current_user.id) && (org_user.id != root_user.id)" class="item">
                        <div :data-id="org_user.id">
                            <img class="ui avatar image" :src="org_user.avatar">
                            <div class="label" v-html="org_user.name"></div>
                        </div>
                    </div>
                    <div class="scrolling menu">
                        <div class="item" v-for="(user, index) in filteredUsers" :key="user.id">
                            <div :data-id="user.id" :data-code="user.code">
                                <i v-if="canDelete(user)" class="remove circle icon removeUser" @click.prevent="removeUser(user, $event)"></i>
                                <img class="ui avatar image" :src="user.avatar">
                                <div class="label">
                                    <span v-html="user.name"></span>
                                    <!-- <span v-if="canDisplayUserType" class="light">{{user.type.toUpperCase()}}</span> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ui inverted dimmer" :class="{active: loading}">
                        <div class="ui text large loader">Switching User</div>
                    </div>
                </div>
            </div>
            <button v-else class="ui button positive tiny" @click="logout">Logout</button>
        </div>
    </div>

</template>

<script>

    import _ from 'lodash'
    import { mapGetters, mapActions } from 'vuex'
    import '../../semantic/src/definitions/modules/dropdown'
    import '../../semantic/src/definitions/modules/transition'


    export default {

        data() {
            return {
                org_user: 0, // Croud.user_switcher.org_user,
                loading: false,
            }
        },

        computed: {
            ...mapGetters({
                current_user: 'universal/user',
                root_user: 'universal/rootUser',
                users: 'universal/userSwitches',
            }),

            canDisplayUserType() {
                if (this.current_user.type === 'client' || this.current_user.type === 'organisation') return false

                return true
            },

            showSwitcher() {
                let userlen = this.users.length

                if (this.root_user.sub !== this.current_user.id) {
                    userlen += 1
                }

                if (this.org_user && this.org_user.id !== null &&
                        ((this.org_user.id !== this.current_user.id) &&
                        (this.org_user.id !== this.root_user.id))
                    ) {
                    userlen += 1
                }

                return userlen > 0
            },
            filteredUsers() {
                return _.reject(this.users, user => user.id === this.current_user.id)
            },
        },

        methods: {
            ...mapActions({
                updateUser: 'universal/updateUser',
                updateRootUser: 'universal/updateRootUser',
                updatePermissions: 'universal/updatePermissions',
                updateJWT: 'universal/updateJWT',
            }),

            logout() {
                this.updateUser({})
                localStorage.removeItem('jwt')
                localStorage.removeItem('root')
                this.$http.get('/logout')
            },
            canDelete(user) {
                if (this.org_user) return false

                if (this.root_user && (user.id === this.root_user.id)) return false

                if (this.root_user.type === 'supercroud') return true

                if (user.type === 'organisation' || user.type === 'client') return false

                return true
            },

            removeUser(user, event) {
                event.stopImmediatePropagation()
                this.$http.get(`/login/delete-known-user/id/${user.id}`).then(() => {
                    this.users.$remove(user)
                })
                this.revert()
            },

            revert() {
                localStorage.setItem('jwt', localStorage.getItem('root'))
                this.updateJWT().then(() => {
                    this.loading = false
                })
                this.$httpLegacy.post('/login/auth/', { authToken: localStorage.getItem('root') }).then(() => {
                    window.location = '/'
                })
            },

            buildDropdown() {
                const $this = this
                $(this.$refs.userSwitcher).dropdown({
                    fullTextSearch: true,
                    forceSelection: false,
                    action(option) {
                        $this.loading = true
                        const block = $(option)
                        const id = block.data('id')
                        const code = block.data('code')

                        if (!$this.root_user.id || $this.root_user.id === $this.current_user.id) {
                            localStorage.setItem('root', localStorage.getItem('jwt'))
                            $this.updateRootUser($this.current_user)
                        } else if ($this.root_user.id === id) {
                            return $this.revert()
                        }

                        return $this.$http.post('auth/switch-user', { user_code: code }).then((response) => {
                            localStorage.setItem('jwt', response.data.jwt.access_token)

                            $this.updateJWT().then(() => {
                                $this.loading = false
                            })

                            $this.$httpLegacy.post('/login/auth/', { authToken: response.data.jwt.access_token }).then(() => {
                                window.location = '/'
                            })
                        })
                    },
                })
            },
        },

        mounted() {
            this.buildDropdown()
        },

        watch: {
            showSwitcher(val) {
                if (!val) return

                this.$nextTick(() => {
                    this.buildDropdown()
                })
            },
        },
    }

</script>
