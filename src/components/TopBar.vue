<template>
    <div id="header" class="development">
        <div id="quickJobHeader">
            <client-picker></client-picker>
        </div>
        <div id="loggedIn">
            <a href="#">
                <croud-avatar :user="user" size="mini" class="thumbnail"/>
                <strong>{{ user.name }}</strong>
            </a>
            <notification-icon/>
        </div>
        <div id="user_switcher">
            <switcher></switcher>
        </div>
        <div class="wrapper">
            <a href="/">
                <h1 id="logo">Croud Control</h1>
            </a>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import CroudAvatar from 'croud-style-guide/src/components/shared/misc/Avatar'
    import ClientPicker from './ClientPicker'
    import Switcher from './UserSwitcher'
    import NotificationIcon from './notifications/Icon'


    export default {
        computed: mapGetters({
            user: 'universal/user',
        }),

        methods: mapActions({
            toggleNotifications: 'notifications/toggle',
        }),

        components: {
            Switcher,
            ClientPicker,
            CroudAvatar,
            NotificationIcon,
        },
    }
</script>

<style scoped>
    #loggedIn .ui.thumbnail.image {
        width: 40px;
        height: 40px;
        vertical-align: middle;
    }
    #loggedIn .ui.thumbnail.image  img {
        width: inherit;
    }
</style>
