
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap')
require('./php-date-formatter.min.js')
require('./jquery.datetimepicker.min.js')
var Element = require('element-ui')


window.Vue = require('vue')

// Vue add-on
window.Vue.prototype.$http = window.axios
window.Vue.use(Element)

// Vue components
Vue.component('example', require('./components/Example.vue'))
Vue.component('reservation', require('./components/Reservation.vue'))

const app = new Vue({
    el: '#app'
})
