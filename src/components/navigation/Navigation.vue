<template>
  <div class="contained scrollable navigation-block">
    <div class="footer">
      <strong class="expand-button" @click.prevent="expanded = !expanded">
          <i :class="{left: expanded, right: !expanded}" class="arrow circle double icon"></i>
      </strong>
    </div>
    <ul data-depth="1">
      <list-item
      v-for="item in filteredItems"
      :item="item"
      :expanded.sync="expanded"
      :key="item.uri"
      />
    </ul>
  </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixin from '../../mixins/navigation'

    import ListItem from './ListItem'

    export default {
        mixins: [mixin],

        components: {
            ListItem,
        },

        computed: {
            expanded: {
                get() {
                    return this.$store.getters['universal/expandedNav']
                },
                set(value) {
                    this.$store.commit('universal/EXPAND_NAV', value)
                },
            },

            ...mapGetters({
                permissions: 'universal/effectivePermissions',
                user: 'universal/user',
            }),
        },
    }
</script>
