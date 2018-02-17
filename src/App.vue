<template>
  <div id="main-container">
    <top-bar v-if="user.id && !suppressTopbar" :user="user"></top-bar>
    <div v-if="loading" class="ui very padded basic center aligned loading-overlay segment">
        <div>
            <img class="ui small image" src='../static/img/croud_logo_new.svg' />
        </div>
    </div>
    <slot name="login" v-else-if="!user.id">
        <login />
    </slot>
    <slot v-else name="custom-layout">
        <div id="main-content" :class="{collapsed: !expanded}">
            <div v-if="!suppressNav" id="main-navigation" class="main-navigation">
                <div class="contained">
                    <navigation />
                </div>
            </div>
            <div :id="!suppressNav ? 'main-content-container' : ''">
                <!-- <div v-if="title" class="headingLinks"><span slot="links"></span></div> -->
                <h1 v-if="title" v-html="title"></h1>
                <div id="main-content-body" v-bind:class="classList">
                    <notifications-sidebar/>
                    <slot v-if="globalPermission" name="content">
                        <h1 class="ui heading">{{ $t('message.hello') }}</h1>
                    </slot>
                    <slot v-else name="denied">
                        <div class="ui basic very padded secondary permissions-denied segment">
                            <div class="ui segment">
                                <div class="ui center aligned icon header">
                                    <i class="circular red delete icon"></i>
                                    <strong>Sorry, you don't have access to this page...</strong>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </slot>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import NotificationsSidebar from './components/notifications/Sidebar'
import TopBar from './components/TopBar'
import Navigation from './components/navigation/Navigation'
import Login from './Login/App'

export default {
    components: { TopBar, Navigation, Login, NotificationsSidebar },
    props: {
        title: {},
        flush: {
            default: true,
        },
        suppressNav: {
            default: false,
        },
        suppressTopbar: {
            default: false,
        },
    },

    computed: {
        classList() {
            const arr = []
            if (this.flush) {
                arr.push('flush-body')
            }
            if (!this.title) {
                arr.push('without-heading')
            }
            return arr.join(' ')
        },

        ...mapGetters({
            user: 'universal/user',
            jwt: 'universal/jwt',
            root: 'universal/root',
            loading: 'universal/loading',
            globalPermission: 'universal/globalPermission',
            expanded: 'universal/expandedNav',
        }),
    },

    methods: {
        ...mapActions({
            updateUser: 'universal/updateUser',
            updatePermissions: 'universal/updatePermissions',
            updateUserSwitches: 'universal/updateUserSwitches',
            authenticate: 'universal/auth',
            loadNotifications: 'notifications/load',
        }),

        handleLogin() {
            if (!this.jwt.sub) return

            this.authenticate().then(() => {
                this.loadNotifications()
            })
        },
    },

    mounted() {
        this.handleLogin()
    },
}
</script>

<style lang="scss">
    @import './sass/layout.scss';

    .ui.basic.loading-overlay.segment {
        background-color: rgba(0,0,0,.75);
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        margin-top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }
</style>

<style scoped>
    .ui.secondary.very.padded.segment.permissions-denied {
        height: calc(100vh - 60px);
    }
</style>
