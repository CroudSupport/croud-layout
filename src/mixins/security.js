import { mapGetters } from 'vuex'

export const checkPermissionHelper = (effectivePermissions, permissionKey) => Object.values(effectivePermissions).indexOf(permissionKey) !== -1 ||
    Object.values(effectivePermissions).indexOf(permissionKey.replace(/\.\w+$/, '.*')) !== -1 ||
    Object.values(effectivePermissions).indexOf(permissionKey.replace(/(\.\w+){2}$/, '.*.*')) !== -1

export default {
    data() {
        return {
            permission: {
                create: false,
                read: false,
                update: false,
                delete: false,
            },
            security: {
                create: false,
                read: false,
                update: false,
                delete: false,
            },
            allowOwner: false,
        }
    },

    computed: Object.assign({}, (0, mapGetters)({
        effectivePermissions: 'universal/effectivePermissions',
        session: 'universal/user',
    }), {
        owner() {
            return this.user && this.user.code === this.session.code
        },
    }),

    methods: {
        setSecurity() {
            Object.keys(this.permission).forEach((key) => {
                if (!this.permission[key]) {
                    return
                }

                if ((this.allowOwner && this.owner) || checkPermissionHelper(this.effectivePermissions, this.permission[key])) {
                    this.security[key] = true
                } else {
                    this.security[key] = false
                }
            })
        },
    },

    created() {
        this.setSecurity()
    },

    watch: {
        effectivePermissions() {
            this.setSecurity()
        },
    },
}
