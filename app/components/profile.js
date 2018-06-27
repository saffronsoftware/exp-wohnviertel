import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import * as util from '../util'


Vue.component('profile', {
  delimiters: ['${', '}'],
  template: '#component-template--profile',
  props: [
    'allData'
  ],
  data: function() {
    return {
    }
  },

  mounted() {
  },

  methods: {
  },
})
