import { defaultsDeep } from 'lodash'
import base from './base'
import notifications from './notifications'

export default defaultsDeep(
    base,
    notifications,
)
