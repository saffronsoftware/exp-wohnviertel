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


const STANDARD_RANK_FORMAT = {
  levels: [
    'Among the highest in Basel',
    'High for Basel',
    'Average for Basel',
    'Low for Basel',
    'Among the lowest in Basel',
  ],
  highest: 'The highest in Basel',
  lowest: 'The lowest in Basel'
}


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
    metrics() {
      return {
        foreigners: {
          name: 'Foreigners',
          formatValue: (d) => Math.round(d * 100, 2) + '%',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getForeignerData),
        },
        welfare: {
          name: 'Welfare',
          formatValue: (d) => Math.round(d * 100, 2) + '%',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getWelfareData),
        },
        wealthGini: {
          name: 'Wealth Inequality',
          formatValue: (d) => d,
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getAugmentedWealthGiniData),
        },
        medianWealth: {
          name: 'Median Wealth',
          formatValue: (d) => util.formatChf(d),
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getMedianWealthData),
        },
        incomeGini: {
          name: 'Income Inequality',
          formatValue: (d) => d,
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getAugmentedIncomeGiniData),
        },
        medianIncome: {
          name: 'Median Income',
          formatValue: (d) => util.formatChf(d),
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getMedianIncomeData),
        },
        employees: {
          name: 'Full-time Employee Equivalents',
          formatValue: (d) => d,
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getEmployeeData),
        },
      }
    }
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
    formatRank(rankInfo, format) {
      if (rankInfo.rank == 1) {
        return format.highest
      } else if (rankInfo.rank == rankInfo.outOf) {
        return format.lowest
      } else {
        return format.levels[rankInfo.rankForPartitions(format.levels.length) - 1]
      }
    }
  },

  mounted() {
  },

  components: {ModelSelect},
})
