<template>
    <div id="quick-selector">
        <span v-if="clientList.length">
            <semantic-form-dropdown value_field="code" v-model="selected_client" :options="clientList" :search="true" :full_text_search="true" placeholder="Choose a client"></semantic-form-dropdown>
            <button @click.stop="viewJob" class="ui button tiny positive">Job</button><button @click.stop="viewClient" class="ui button tiny blue">Client</button>
        </span>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                // storageKey: `quick-selector-${Croud.systemSettings.user.code}`,
                selected_client: null,
            }
        },

        computed: {
            ...mapGetters({
                clientList: 'universal/clients',
            }),
        },

        // mounted() {
        //     this.selected_client = window.localStorage.getItem(this.storageKey)
        // },

        methods: {
            viewClient() {
                if (this.selected_client) { window.location = `/control/view-client/id/${this.selected_client}#work` }
            },

            viewJob() {
                if (this.selected_client) { window.location = `/job/assign/id/${this.selected_client}` }
            },
        },

        watch: {
            selected_client(newValue, oldValue) {
                if (newValue !== oldValue) {
                    window.localStorage.setItem(this.storageKey, newValue)
                }
            },
        },
    }
</script>

<style scoped>
    #quick-selector {
        position:absolute;
        z-index:10;
        margin-top:5px;
    }

    .ui.selection.dropdown {
        width: 250px
    }
</style>
