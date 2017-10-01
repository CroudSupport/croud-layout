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
    import { mapGetters } from 'vuex'
    import CroudAvatar from 'croud-style-guide/src/components/shared/misc/Avatar'
    import ClientPicker from './ClientPicker'
    import Switcher from './UserSwitcher'


    export default {
        computed: mapGetters({
            user: 'universal/user',
        }),

        components: {
            Switcher,
            ClientPicker,
            CroudAvatar,
        },
    }
</script>

<style scoped>
    #loggedIn .ui.thumbnail.image {
        width: 40px;
        height: 40px;
        vertical-align: middle;
    }
</style>
