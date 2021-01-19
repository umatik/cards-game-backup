import Vue from 'vue'
import Game from "@/Game";
import {BootstrapVue} from 'bootstrap-vue'

Vue.config.productionTip = false
// Why require not import? It's frontend app, require is used for nodejs enviroment
window.axios = require('axios');

Vue.use(BootstrapVue);

new Vue({
    render: h => h(Game),

}).$mount('#app')
