import jwtDecode from '../../../src/store/jwtSafeDecode'

describe('jwtSafeDecode', () => {
    test('valid token', () => {
        expect(jwtDecode('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFiODYzNDBmYTFjOTU5YTA2OWY1NTBmNDI0MDJkNDQxOTgxOGIxNjdiOTYwZmQ2ZDE1OWViODQ4ODFlMmIyOTU3NjgzMDQ1Y2Y3NTIxMGQ0In0.eyJhdWQiOiJnYXRld2F5LWlyZWxhbmQiLCJqdGkiOiIxYjg2MzQwZmExYzk1OWEwNjlmNTUwZjQyNDAyZDQ0MTk4MThiMTY3Yjk2MGZkNmQxNTllYjg0ODgxZTJiMjk1NzY4MzA0NWNmNzUyMTBkNCIsImlhdCI6MTUyNzc3NjAzMSwibmJmIjoxNTI3Nzc2MDMxLCJleHAiOjE1MjgwMzUyMzAsInN1YiI6IjI3NjUiLCJzY29wZXMiOltdfQ.pAFuOxJKUnkvXu_fop56LHuawgb_DNn0eQrmxOhxp1hj8WrvsWeOUXjEAJWRg_7cXNGRYKjrMxs7WS-EijfBniD5dvmOBOhr49Jgdt-nGbfRmTpvMaj5wxBUvKg6ZCroij18S4RGnFFaWKVFhLKuaxVPMN1MEWWKVYhvK8cijrcErS1YTdA_93a6c35U3hxbZhmjFfupQfHwCNM4sxDP9XaAAK4hEUD4AObQ28XZGeGn9S8XC_UzFp98d5Bx5Y8GRab0ztuVdzUzN9zKp7WBjLvhMZOOtvvhg0aKG5QyEfTsa9tH0WbjBg12xBBvzdh1OVXGjePVl1VTsXts2cewQY-jR0t5nl8bpT_CDtM8DQD8dhR53daRXEd7lIyfLIoBE__6TTFf1fy4FFcrf51t9Eyl8596T7qp9PGtjVCvHOzaKL284WNfRuv_KglXIF1rr4CxSIXo63ZVLUmN-PfLBNVjDVZ8ZAAvd1Olwnuzw49hy6uK2HluX7HngxcZQHI1xyw6sGA4NIS11Srum8vFAHUXxdsq8dtaGnpK2b1-I_om3JxZ4LW_uKr0nzhvwOxiBgcipmVd3ziLB9DgZRfQKx-OohE_S3r-0v1R6cxfO0YZY_b93H61xmCRYz5lWDEhWt8SJ7Lg7XeCPNLT5Zyc0WQNdavwEt7WK-P9KAKCiPo')).toMatchSnapshot()
    })

    test('invalid token', () => {
        expect(jwtDecode('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFiODYzNDBmYTFjOTU5YTA2OWY1NTBmNDI0MDJkNDQxOTgxOGIxNjdiOTYwZmQ2ZDE1OWViODQ4ODFlMmIyOTU3NjgzMDQ1Y2Y3NTIxMGQ0In0')).toEqual({})
    })

    test('empty token', () => {
        expect(jwtDecode('')).toEqual({})
    })
})
