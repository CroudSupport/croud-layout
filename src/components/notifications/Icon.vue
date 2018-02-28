<template>
    <span class="notification-icon" @click="toggleNotifications">
        <i class="white bell link icon"></i>
        <span class="ui tiny circular floating yellow label" :class="{pulse: shouldPulse}">{{ count }}</span>
    </span>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data() {
            return {
                shouldPulse: false,
            }
        },

        computed: mapGetters({
            count: 'notifications/count',
            showNotifications: 'notifications/show',
        }),

        methods: mapActions({
            toggleNotifications: 'notifications/toggle',
        }),

        watch: {
            count() {
                this.shouldPulse = true
            },

            showNotifications() {
                this.shouldPulse = false
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~croud-style-guide/src/resources/sass/variables/_all.scss';

    .notification-icon {
        position: relative;
        margin-left: 2em;
        cursor: pointer;

        .link.icon {
            font-size: 1.8em;
        }
    }

    .pulse {
        border-radius: 50%;
        background: $croud-colour-warning-accent;
        box-shadow: 0 0 0 rgba(204,169,44, 0.9);
        animation: pulse 1.5s infinite;

        &:hover {
            animation: none;
        }
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(204,169,44, 0.9);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(204,169,44, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(204,169,44, 0);
        }
    }
</style>

