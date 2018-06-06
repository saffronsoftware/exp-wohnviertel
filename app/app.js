import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import './components/hero'
import './components/page'
import './components/range-chart'
import './components/bar-chart'
import './components/stack-chart'
import './components/map-chart'

new Vue({el: '#page-container'})
