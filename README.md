# croud-layout
[![Build Status](https://travis-ci.org/CroudSupport/croud-layout.svg?branch=master)](https://travis-ci.org/CroudSupport/croud-layout)
[![npm version](https://badge.fury.io/js/croud-layout.svg)](https://badge.fury.io/js/croud-layout)

## Plugin
Step 1: Install plugin
```bash
yarn add croud-layout
```

Step 2: Add it to your project

```js
import CroudLayout from 'croud-layout'
import store from './store'
Vue.use(CroudLayout, { store })

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<croud-layout><App slot="content"/></croud-layout>',
    components: { App },
    store,
})

```

Step 3: ????

Step 4: Profit :)

## No Legacy SSO Auth
You can pass an additional option to disable legacy SSO auth
```js
Vue.use(CroudLayout, { store, noLegacyAuth: true })
```

## il8n
croud-layout uses a translation first approach to it's text declaration and requires that you add some extra config to your project before using this plugin.

We use the [vue-il8n](https://github.com/kazupon/vue-i18n/) and you can find their docs [here](https://kazupon.github.io/vue-i18n/en/)

### Basic usage
This package includes a translation factory which can be easily added to your project.
```js
/* Main.js */
...
import { translationFactory } from 'croud-layout/src/translation'
...

const i18n = translationFactory()
new Vue({
    i18n,
    ...
})
```

### Package translation
By default, the translation factory will load a base set of translations. You can pass in additional translations as the first argument of the translation factory.

```js
const i18n = translationFactory({
    en: {
        custom: {
            test: 'test string',
        },
    },
})
```

### Set locale
You can set the locale with the second argument of the translation factory.
```js
const i18n = translationFactory({}, 'ja')
```
## Axios plugin
A drop in replacement for vue-resource

### Basic usage

```js
/* Main.js */
...
import axios from 'croud-layout/src/axios'
...

new Vue({
...
    created() {
        Vue.use(axios, { setCroudDefaults: true })
    },
})

```

## Security Mixin
Croud-layout now includes the **Security** mixin that can make quick *CRUD* permission checks for the current user.

### Basic Usage ###

```js
import Security from 'croud-layout/src/mixin/security'

export default {
    mixins: [Security],

    data() {
        return {
            permission: {
                read: 'my-read-permission',
                custom: 'my-custom-permission',
            },
        },
    },
}
```
This will add a **security** object to your component that looks like this (if they have the correct permissions)...

```js
{
    create: false,
    read: true,
    update: false,
    delete: false,
    custom: true,
}
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
