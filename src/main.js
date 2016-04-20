require('./../node_modules/purecss/build/base.css');
require('./../node_modules/purecss/build/grids-min.css');

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
    history           : true,
    saveScrollPosition: true
});

router.map({
    '/': {
        component: require('./home/home.vue')
    }
});

const App = Vue.extend(require('./App.vue'));
router.start(App, '#app');