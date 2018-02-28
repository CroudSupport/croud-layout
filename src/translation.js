import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { defaultsDeep } from 'lodash'

import messages from './il8n'

Vue.use(VueI18n)

/* eslint-disable import/prefer-default-export */
export function translationFactory(projectMessages = {}, locale = 'en') {
    return new VueI18n({
        locale,
        fallbackLocale: 'en',
        messages: defaultsDeep(messages, projectMessages),
    })
}
