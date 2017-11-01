<template>
    <croud-side-bar v-show="showNotifications" @close="toggleNotifications">
        <div slot="topbar" class="ui secondary segment">
            <div class="ui two column middle aligned grid">
                <div class="column">
                    <h3 class="ui header">Notifications</h3>
                </div>
                <div class="right aligned column">
                    <button class="ui mini basic blue button" @click="toggleNotifications">Close</button>
                    <button class="ui mini blue button" @click="markAllRead">Mark all as read</button>
                </div>
            </div>
        </div>
        <notifications></notifications>
    </croud-side-bar>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import CroudSideBar from 'croud-style-guide/src/components/shared/layout/Sidebar'
    import Notifications from './Notifications'

    export default {
        components: {
            Notifications,
            CroudSideBar,
        },

        methods: mapActions({
            toggleNotifications: 'notifications/toggle',
            markAllRead: 'notifications/markAllRead',
        }),

        computed: mapGetters({
            showNotifications: 'notifications/show',
        }),
    }
</script>
