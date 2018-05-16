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
            <croud-list-dropdown
                v-if="showSwitcher"
                listGetter="universal/userSwitches"
                :headerItem="currentUser"
                @item-selected="switchUser"
                :loading="loading"
                dropdownClasses="ui floating top right pointing dropdown tiny positive button"
                :dropdownSettings="settings"
                >

                <div slot="header-action">
                    <button class="ui button tiny blue" @click.stop="logout">Logout</button>
                </div>

                <div slot="header-item">
                    <croud-avatar  size="avatar" :user="currentUser" />
                    <div class="label">{{ currentUser.name }}</div>
                </div>

                <template slot="extra-items" class="menu">
                    <div class="ui icon transparent fluid search input">
                        <i class="search icon"></i>
                        <input type="text" placeholder="Search users...">
                    </div>
                    <div v-if="rootUser.id && rootUser.id !== currentUser.id" class="item" @click="revert">
                        <div>
                            <croud-avatar  size="avatar" :user="rootUser" />
                            <div class="label">{{ rootUser.name }}</div>
                        </div>
                    </div>
                    <div class="divider"></div>
                </template>

                <template slot="items" scope="scope">
                    <div>
                        <lazy-load>
                            <croud-avatar size="avatar" :user="scope.item" v-if="clicked"/>
                        </lazy-load>
                        <div class="label">{{ scope.item.name }}</div>
                    </div>
                </template>
            </croud-list-dropdown>

            <button v-else class="ui button positive tiny" @click="logout">Logout</button>
        </div>
    </div>

</template>

<script>
    import LazyLoad from 'croud-style-guide/src/components/shared/hoc/LazyLoad'
    import CroudListDropdown from 'croud-style-guide/src/components/shared/misc/List'
    import CroudAvatar from 'croud-style-guide/src/components/shared/misc/Avatar'
    import { mapGetters, mapActions } from 'vuex'
    import '../../semantic/src/definitions/modules/dropdown'
    import '../../semantic/src/definitions/modules/transition'


    export default {

        components: {
            CroudListDropdown,
            CroudAvatar,
            LazyLoad,
        },

        data() {
            return {
                clicked: false,
                loading: false,
                settings: {
                    forceSelection: false,
                    fullTextSearch: true,
                    action: 'nothing',
                    onShow: () => {
                        this.clicked = true
                    },
                },
            }
        },

        computed: {
            ...mapGetters({
                currentUser: 'universal/user',
                rootUser: 'universal/rootUser',
                users: 'universal/userSwitches',
                legacyAuth: 'universal/legacyAuth',
            }),

            showSwitcher() {
                return this.users.length || this.rootUser.sub !== this.currentUser.id
            },
        },

        methods: {
            ...mapActions({
                updateUser: 'universal/updateUser',
                updateRootUser: 'universal/updateRootUser',
                updatePermissions: 'universal/updatePermissions',
                updateJWT: 'universal/updateJWT',
            }),

            switchUser(user) {
                this.loading = true
                if (!this.rootUser.id || this.rootUser.id === this.currentUser.id) {
                    localStorage.setItem('root', localStorage.getItem('jwt'))
                    this.updateRootUser(this.currentUser)
                } else if (this.rootUser.id === user.id) {
                    return this.revert()
                }

                return this.$http.post('auth/switch-user', { user_code: user.code }).then((response) => {
                    localStorage.setItem('jwt', response.data.jwt.access_token)

                    this.updateJWT().then(() => {
                        this.loading = false
                    })

                    if (this.legacyAuth) {
                        this.$httpLegacy.post('/authenticate/', { authToken: response.data.jwt.access_token })
                            .then(this.redirectAfterLogin)
                    }
                })
            },

            logout() {
                this.updateUser({})
                localStorage.removeItem('jwt')
                localStorage.removeItem('root')
                if (this.legacyAuth) {
                    this.$httpLegacy.get('/logout')
                    window.location = '/logout'
                }
            },

            revert() {
                this.loading = true
                localStorage.setItem('jwt', localStorage.getItem('root'))
                this.updateJWT().then(() => {
                    this.loading = false
                })
                if (this.legacyAuth) {
                    this.$httpLegacy.post('/authenticate/', { authToken: localStorage.getItem('root') })
                        .then(this.redirectAfterLogin)
                }
            },

            redirectAfterLogin() {
                window.location = '/'
            },
        },
    }

</script>
