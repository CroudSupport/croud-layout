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

## Echo websockets
The croud-layout plugin will add and set up [vue-echo](https://github.com/happyDemon/vue-echo) for your project.

```js
//App.vue
this.$echo.private(`App.Model.User.${this.jwt.sub}`)
    .listen('PushNotification', (e) => {
        this.newMessage(e.data)
    })
```
See their docs for more examples.

### Notifications
Croud-layout's frame now includes the notification's sidebar which uses the websockets to update notifications in realtime.

## Moment
The croud-layout plugin will add [vue-moment](https://github.com/brockpetrie/vue-moment) to your project. This will globally register the moment filter...
```html
<div>{{ date | moment('YYYY-MM-DD')}}</div>
```

...and also add $moment to the Vue prototype...

```js
//App.vue
this.$moment(date).format('YYYY-MM-DD')
```

See their docs for more examples.

### Custom moment instance
You can pass in a custom moment instance to replace vue-moment's default instance by adding a moment object to the croud-layout plugin options

```js
import moment from 'moment-timezone'
...
Vue.use(CroudLayout, { store, moment })
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
