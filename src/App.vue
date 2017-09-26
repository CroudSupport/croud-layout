<template>
  <div id="main-container">
    <top-bar v-if="user.id && !suppressTopbar" :user="user"></top-bar>
    <div v-if="loading" class="ui very padded basic center aligned loading-overlay segment">
        <div>
            <img class="ui small image" src='../static/img/croud_logo_new.svg' />
        </div>
    </div>
    <login v-else-if="!user.id"></login>
    <slot v-else name="custom-layout">
        <div id="main-content">
            <div v-if="!suppressNav" id="main-navigation" class="main-navigation">
                <div class="contained">
                    <navigation
                    :expanded="expanded"
                    :items="items"
                    >
                    </navigation>
                </div>
            </div>
            <div :id="!suppressNav ? 'main-content-container' : ''">
                <!-- <div v-if="title" class="headingLinks"><span slot="links"></span></div> -->
                <h1 v-if="title" v-html="title"></h1>
                <div id="main-content-body" v-bind:class="classList">
                    <slot name="content">
                        <h1 class="ui heading">Test</h1>
                    </slot>
                </div>
            </div>
        </div>
    </slot>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import TopBar from './components/TopBar'
import Navigation from './Navigation/App'
import Login from './Login/App'

export default {
    components: { TopBar, Navigation, Login },
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
        }),
    },

    methods: {
        ...mapActions({
            updateUser: 'universal/updateUser',
            updatePermissions: 'universal/updatePermissions',
            updateUserSwitches: 'universal/updateUserSwitches',
            authenticate: 'universal/auth',
        }),

        handleLogin() {
            if (!this.jwt.sub) return

            this.authenticate()
        },
    },

    data() {
        return {
            items: [],
            expanded: false,
        }
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
