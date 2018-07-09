import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import {ModelSelect} from 'vue-search-select'
import * as d3 from 'd3'
import * as _ from 'lodash'
import * as dataGetters from '../data-getters'
import * as colors from '../colors'
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
      colors: colors,
      district: 'st-alban',
      districts: DISTRICTS,
    }
  },
  computed: {
    districtName() {
      return DISTRICT_NAMES[this.district]
    },
    districtOptions() {
      return DISTRICTS.map((district) => {
        return {
          value: district,
          text: DISTRICT_NAMES[district],
        }
      })
    },
    foreignerData() {
      return this.getDataByFunction(dataGetters.getForeignerData)
    },
    welfareData() {
      return this.getDataByFunction(dataGetters.getWelfareData)
    },
    medianWealthData() {
      return this.getDataByFunction(dataGetters.getMedianWealthData)
    },
    averageWealthData() {
      return this.getDataByFunction(dataGetters.getAverageWealthData)
    },
    medianIncomeData() {
      return this.getDataByFunction(dataGetters.getMedianIncomeData)
    },
    averageIncomeData() {
      return this.getDataByFunction(dataGetters.getAverageIncomeData)
    },
  },

  methods: {
    changeDistrict(newDistrict) {
      this.district = newDistrict
    },
    getDataByFunction(fn) {
      const data = fn(this.allData)()
      return {
        value: dataGetters.valueForDistrict(data, this.district),
        rankInfo: dataGetters.rankForDistrict(data, this.district),
      }
    },
    formatChf(n) {
      return util.formatChf(n)
    },
  },

  mounted() {
  },

  components: {ModelSelect},
})
