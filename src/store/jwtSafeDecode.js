import jwtDecode from 'jwt-decode'

export default (jwt) => {
    try {
        return jwt ? jwtDecode(jwt) : {}
    } catch (e) {
        return {}
    }
}
