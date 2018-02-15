import Vue from 'vue'
import navigation from '../../../src/mixins/navigation'

const vm = new Vue({
    data() {
        return {
            user: {
                system: false,
                onboarding: false,
            },
            permissions: [
                'menu.dashboard.read',
                'menu.academy.read',
                'academy.submission.manage',
                'menu.manageUsers.read',
            ],
        }
    },
    computed: {
        items() {
            return this.baseItems
        },
    },
    render: h => h(),
    mixins: [navigation],
}).$mount()

describe('Navigation mixin', () => {
    describe('Base items array', () => {
        afterAll((next) => {
            vm.user = {
                system: true,
                onboarding: false,
            }

            vm.$nextTick(next)
        })
        it('should produce base SC menu', () => {
            expect(typeof vm.items).toEqual('object')
            expect(vm.items).toMatchSnapshot()
        })

        it('should produce base croudie menu', () => {
            vm.user.system = false
            vm.$nextTick(() => {
                expect(typeof vm.items).toEqual('object')
                expect(vm.items).toMatchSnapshot()
            })
        })

        it('should produce base onboarding croudie menu', () => {
            vm.user = {
                system: false,
                onboarding: true,
            }
            vm.$nextTick(() => {
                expect(typeof vm.items).toEqual('object')
                expect(vm.items).toMatchSnapshot()
            })
        })
    })

    describe('Filtered item array', () => {
        afterAll((next) => {
            vm.user = {
                system: true,
                onboarding: false,
            }

            vm.$nextTick(next)
        })

        describe('SC menu', () => {
            it('should produce menu', () => {
                vm.$nextTick(() => {
                    expect(typeof vm.filteredItems).toEqual('object')
                    expect(vm.filteredItems).toMatchSnapshot()
                })
            })

            it('should build children menu', () => {
                vm.$nextTick(() => {
                    expect(Array.isArray(vm.filteredItems.filter(i => i.children)[0].children)).toEqual(true)
                    expect(vm.filteredItems.filter(i => i.children)[0].children.length).toEqual(3)
                })
            })
        })

        describe('Croudie menu', () => {
            it('should produce menu', () => {
                vm.user.system = false
                vm.$nextTick(() => {
                    expect(vm.filteredItems).toMatchSnapshot()
                })
            })
        })

        describe('Onboarding Croudie menu', () => {
            it('should produce menu', () => {
                vm.user = {
                    system: false,
                    onboarding: true,
                }
                vm.$nextTick(() => {
                    expect(vm.filteredItems).toMatchSnapshot()
                })
            })
        })
    })
})
