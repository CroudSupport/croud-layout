<template>
  <li :class="activeClass">
    <a v-if="item.children && item.children.length" @click.prevent="toggleItem" :id="itemSlug" :class="linkClass" :href="item.uri">
      <i v-if="item.icon != ''" :class="item.icon + ' link-icon'"></i>
      <span><i :class="linkIcon"></i>
          {{item.label}}
      </span>
    </a>
    <a v-else :id="itemSlug" :class="item.class" :href="item.uri" :target="item.target">
      <i v-if="item.icon != ''" :class="item.icon + ' link-icon'"></i>
      <span v-html="item.label"></span>
    </a>
    <div v-if="item.children && localItem.expanded" class="children">
        <ul :data-depth="depth+1" class="child-menu" >
        <list-item :item="child" :depth="depth+1" v-for="child in item.children" :key="child.uri" :expanded="expanded"></list-item>
        </ul>
    </div>
  </li>
</template>

<script>
    export default {
        name: 'ListItem',

        props: {
            item: {
                type: Object,
                required: true,
            },
            depth: {
                type: Number,
                default: 1,
            },
            expanded: {
                type: Boolean,
                required: true,
            },
        },

        data() {
            return {
                popoverTarget: null,
                localItem: this.item,
            }
        },

        computed: {
            activeClass() {
                if (!this.item.uri || this.item.uri.length < 1) return ''

                const uri = window.location.pathname.substr(1)
                return uri === this.item.uri.substring(1) ? 'active' : ''
            },

            linkIcon() {
                return this.localItem.expanded ? 'caret down icon expandable' : 'caret right icon expandable'
            },

            itemSlug() {
                return `menuitem-${this.item.label.toLowerCase().replace(/[^a-z0-9+]+/gi, '')}`
            },

            linkClass() {
                const itemClass = this.item.class || ''
                return this.localItem.expanded ? `${itemClass} sub-menu opened` : `${itemClass} sub-menu closed`
            },
        },

        methods: {
            toggleItem() {
                this.$emit('update:expanded', true)
                this.localItem.expanded = !this.localItem.expanded
            },
        },
    }
</script>
