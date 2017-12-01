export default {
    computed: {
        filteredItems() {
            const recur = (item) => {
                if (item.children) {
                    item.children = item.children.filter(recur)
                }

                return !item.permission || Object.values(this.permissions).indexOf(item.permission) !== -1
            }

            return this.items.filter(recur)
        },

        baseItems() {
            const global = [
                {
                    label: 'Dashboard',
                    uri: '/',
                    icon: 'dashboard icon',
                },
                {
                    label: 'Bearhug',
                    uri: '/bearhug/index/standalone',
                    icon: 'paw icon',
                    permission: 'menu.dashboard.read',
                },
                {
                    label: 'Croud Academy',
                    uri: '/academy/',
                    icon: 'university icon',
                    expanded: false,
                    permission: 'menu.academy.read',
                    children: [
                        {
                            label: 'My Courses',
                            uri: '/academy/course/owned/',
                            permission: 'menu.academy.read',
                        },
                        {
                            label: 'Available Courses',
                            uri: '/academy/course/available/',
                            permission: 'menu.academy.read',
                        },
                        {
                            label: 'Review Submissions',
                            uri: '/academy/assessment/',
                            permission: 'academy.submission.manage',
                        },
                        {
                            label: 'Courses',
                            uri: '/academy/course/',
                            permission: 'academy.course.manage',
                        },
                        {
                            label: 'Modules',
                            uri: '/academy/modules/',
                            permission: 'academy.modules.manage',
                        },
                        {
                            label: 'Test',
                            uri: '/survey/',
                            permission: 'academy.survey.manage',
                        },
                        {
                            label: 'Qualifications',
                            uri: '/academy/qualification/',
                            permission: 'academy.qualification.manage',
                        },
                        {
                            label: 'Skillsets',
                            uri: '/academy/skillset/',
                            permission: 'academy.skillset.manage',
                        },
                    ],
                },
                {
                    label: 'User Management',
                    uri: '/users/manager',
                    icon: 'users icon',
                    permission: 'menu.manageUsers.read',
                },
                {
                    label: 'Knowledge Base',
                    uri: '/knowledge-base/',
                    icon: 'help circle icon',
                    permission: 'menu.knowledgebase.read',
                },
                {
                    label: 'Finance &amp; Invoicing',
                    uri: '/admin/finance',
                    icon: 'money icon',
                    permission: 'menu.finance.read',
                },
                {
                    label: 'Reporting',
                    uri: '/reporting/index/',
                    icon: 'bar chart icon',
                    permission: 'reports.reports.report',
                },
                {
                    label: 'System Settings',
                    uri: '/default/system/index',
                    icon: 'settings icon',
                    permission: 'menu.system.read',
                },
                {
                    label: 'My Details',
                    uri: '/user/account',
                    icon: 'user icon',
                },
            ]

            if (this.user.system) {
                return [
                    ...global,
                    {
                        label: 'Datorama',
                        uri: 'https://performance.croudcontrol.com',
                        icon: 'external-link datorama-link datorama icon',

                    },

                    {
                        label: 'Schoox',
                        uri: 'https://www.schoox.com/login.php',
                        icon: 'external-link schoox-link schoox icon',

                    },

                    {
                        label: 'Croud HR',
                        uri: 'https://croud.peoplehr.net',
                        icon: 'external-link peoplehr-link peoplehr icon icon',

                    },
                ]
            }

            if (this.user.onboarding) {
                return [
                    {
                        label: 'My Academy Courses',
                        uri: '/academy/course/owned/',

                        permission: 'menu.academy.read',
                    },
                    {
                        label: 'Available Academy Courses',
                        uri: '/academy/course/owned/',

                        permission: 'menu.academy.read',
                    },
                    {
                        label: 'My Details',
                        uri: '/user/account',
                        icon: 'user icon',

                    },
                ]
            }

            return [
                ...global,
                {
                    label: 'Help Centre',
                    uri: 'https://croud.freshdesk.com/support/solutions',
                    icon: 'help circle outline icon',

                },
            ]
        },

        items() {
            const stashed = JSON.parse(localStorage.getItem(`main_navigation_${this.user.code}`))

            if (stashed && stashed.data && stashed.data.list) {
                return stashed.data.list
            }

            return this.baseItems
        },
    },
}
