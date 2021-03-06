// Settings for Vue
window.Vue = require('vue')

// Vue add-on

// Element-UI
const Element = require('element-ui')
window.Vue.use(Element)
import 'element-ui/lib/theme-default/index.css'

// Axios
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

window.Vue.prototype.$startLoading = function () {
    this.$loadingInstance = this.$loading({ 
        fullscreen: true,
        lock: true,
        text: 'LOADING...',
    })
    return this.$loadingInstance
}

window.Vue.prototype.$stopLoading = function (loadingInstance = null) {
    loadingInstance = loadingInstance || this.$loadingInstance
    loadingInstance.close()
}

window.vm = new Vue({
    el: '#app',

    components: {
        'reservation': require('./components/Reservation.vue'),
        'flatpickr': require('./components/Flatpickr.vue')
    }
})
