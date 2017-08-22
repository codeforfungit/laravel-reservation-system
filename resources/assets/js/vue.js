// Settings for Vue
const Element = require('element-ui')
import vueEventCalendar from 'vue-event-calendar'

window.Vue = require('vue')

// Vue add-on
window.Vue.use(Element)

if (!window.axios) {
    window.axios = require('axios')
    window.axios.defaults.withCredentials = true
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    let token = document.head.querySelector('meta[name="csrf-token"]')

    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
    }
}
window.Vue.prototype.$http = window.axios

const app = new Vue({
    el: '#app',

    components: {
        'reservation': require('./components/Reservation.vue'),
        'flatpickr': require('./components/Flatpickr.vue')
    }
})
