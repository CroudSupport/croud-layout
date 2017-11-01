<template>
    <div class="ui basic segment">
        <div class="ui segment" v-for="notification in notifications" :key="notification.id">
            <div class="ui two column grid">
                <div class="ten wide column">
                    <div class="ui text vertical fluid menu">
                        <div class="header item">
                            {{ notification.name }}
                        </div>
                        <div class="item">
                            <small>{{ notification.deliver_at.date | moment('ll') }}</small>
                        </div>
                    </div>
                </div>
                <div class="six wide right aligned column">
                    <div class="ui mini buttons">
                        <a v-if="notification.parent_link" class="ui link blue button" :href="notification.parent_link">View Record</a>
                        <button @click="readNotification(notification.id)" class="ui link basic blue button">Mark as read</button>
                    </div>
                </div>
            </div>

            <p v-html="notification.content"></p>
        </div>
        <div v-if="!notifications.length" class="ui basic center aligned very padded segment">
            <h3 class="ui icon header">
                <i class="ui comments outline circular yellow icon"></i>
                No new notifications
            </h3>
        </div>

        <div v-if="canLoadMore" class="ui center aligned basic segment">
            <button class="ui basic blue button" @click="loadMore">Load More</button>
        </div>

    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        computed: mapGetters({
            notifications: 'notifications/all',
            canLoadMore: 'notifications/more',
            jwt: 'jwt/data',
        }),

        methods: {
            ...mapActions({
                loadNotifications: 'notifications/load',
                loadMore: 'notifications/loadMore',
                newMessage: 'notifications/newMessage',
            }),

            readNotification(id) {
                this.$http.post(`api/notification/read/${id}`).finally(() => {
                    this.loadNotifications()
                })
            },
        },

        created() {
            this.$echo.private(`App.Model.User.${this.jwt.sub}`)
                .listen('PushNotification', (e) => {
                    this.newMessage(e.data)
                })
        },
    }
</script>

<style scoped lang="scss">
    .ui.text.vertical.menu {
        .item {
            padding: 0;
            margin: 0;
            &.header {
                font-weight: bold;
                font-size: 1.15em;
                text-transform: inherit;
            }
        }

    }
</style>
