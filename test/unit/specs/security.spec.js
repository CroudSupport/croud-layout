import { checkPermissionHelper } from '../../../src/mixins/security'

const effectivePermissions = [
    'user.*.*',
    'finance.invoice.*',
    'bearhug.client-service.create',
]

describe('Security Mixin', () => {
    describe('checkPermissionHelper', () => {
        it('should check definitive permissions', () => {
            expect(checkPermissionHelper(effectivePermissions, 'bearhug.client-service.create')).toBe(true)
            expect(checkPermissionHelper(effectivePermissions, 'bearhug.client-service.read')).toBe(false)
            expect(checkPermissionHelper(effectivePermissions, 'bearhug.false.create')).toBe(false)
        })
        it('should check wildcard permissions', () => {
            expect(checkPermissionHelper(effectivePermissions, 'finance.invoice.read')).toBe(true)
            expect(checkPermissionHelper(effectivePermissions, 'finance.fail.read')).toBe(false)
        })
        it('should check top level wildcard permissions', () => {
            expect(checkPermissionHelper(effectivePermissions, 'user.test.read')).toBe(true)
        })
    })
})
