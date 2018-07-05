import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import * as dataGetters from '../data-getters'
import {DISTRICTS, DISTRICT_NAMES} from '../common'
import * as util from '../util'


Vue.component('profile', {
  delimiters: ['${', '}'],
  template: '#component-template--profile',
  props: [
    'allData'
  ],
  data: function() {
    return {
      district: 'st-alban',
    }
  },
  computed: {
    districtName() {
      return DISTRICT_NAMES[this.district]
    },
    foreignerData() {
      const data = dataGetters.getForeignerData(this.allData)()
      return {
        value: dataGetters.valueForDistrict(data, this.district),
        rankInfo: dataGetters.rankForDistrict(data, this.district),
      }
    }
  },

  mounted() {
  },

  methods: {
  },
})
