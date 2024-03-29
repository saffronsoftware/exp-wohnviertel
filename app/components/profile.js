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
const ScrollReveal = require('scrollreveal') // oof.mp3


const STANDARD_RANK_FORMAT = {
  levels: [
    'among the highest in Basel',
    'high for Basel',
    'average for Basel',
    'low for Basel',
    'among the lowest in Basel',
  ],
  highest: 'the highest in Basel',
  lowest: 'the lowest in Basel'
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
          formatValue: (d) => Math.round(d * 100, 2) + '% of residents',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getForeignerData),
        },
        welfare: {
          name: 'Welfare',
          formatValue: (d) => Math.round(d * 100, 2) + '% of residents',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getWelfareData),
        },
        medianIncome: {
          name: 'Average Net Income',
          formatValue: (d) => util.formatChf(d),
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getMedianIncomeData),
        },
        medianWealth: {
          name: 'Average Net Worth',
          formatValue: (d) => util.formatChf(d),
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getMedianWealthData),
        },
        incomeGini: {
          name: 'Income Inequality',
          formatValue: (d) => d3.format('.2f')(d) + '/1.00',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getAugmentedIncomeGiniData),
        },
        wealthGini: {
          name: 'Wealth Inequality',
          formatValue: (d) => d3.format('.2f')(d) + '/1.00',
          rankFormat: STANDARD_RANK_FORMAT,
          data: this.getDataByFunction(dataGetters.getAugmentedWealthGiniData),
        },
        employees: {
          name: 'Workers',
          formatValue: (d) => d3.format(',.2f')(d),
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
    this.scrollReveal = ScrollReveal()
    this.scrollReveal.reveal('.profile .profile-metrics .metric', 100)
  },

  components: {ModelSelect},
})
