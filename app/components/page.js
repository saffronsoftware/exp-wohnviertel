import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import VueSlideUpDown from 'vue-slide-up-down'
import * as d3 from 'd3'
import * as data from '../data'
import {DISTRICT_NAMES} from '../common'
import * as dataGetters from '../data-getters'
import * as colors from '../colors'
import * as util from '../util'
import device from 'current-device'


Vue.component('page', {
  delimiters: ['${', '}'],
  template: '#component-template--page',
  data: function() {
    return {
      allData: null,
      colors: colors,
      foreignersChart: {
        getData: null,
      },
      welfareChart: {
        getData: null,
      },
      augmentedWealthGiniChart: {
        getData: null,
      },
      wealthGiniChart: {
        getData: null,
      },
      medianWealthChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: util.formatChfShort,
      },
      averageWealthChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: util.formatChfShort,
      },
      areWealthDetailsVisible: false,
      augmentedIncomeGiniChart: {
        getData: null,
      },
      incomeGiniChart: {
        getData: null,
      },
      medianIncomeChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: util.formatChfShort,
      },
      averageIncomeChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: util.formatChfShort,
      },
      areIncomeDetailsVisible: false,
      citizenshipChart: {
        getData: null,
        getKeys: dataGetters.getCitizenshipKeys,
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc']),
      },
      religionChart: {
        getData: null,
        getKeys: dataGetters.getReligionKeys,
        defaultSort: dataGetters.getReligionDefaultSort(),
        colors: [
          colors.GRAPHIQ3_12_LOWER[0],
          colors.GRAPHIQ3_12_LOWER[2],
          colors.GRAPHIQ3_12_LOWER[3],
          colors.GRAPHIQ3_12_LOWER[5],
          colors.GRAPHIQ3_12_LOWER[7],
          colors.GRAPHIQ3_12_LOWER[9],
          colors.GRAPHIQ3_12_LOWER[11],
          '#aaaaaa',
          '#cccccc',
        ],
      },
      ageChart: {
        getData: null,
        getKeys: dataGetters.getAgeKeys,
        defaultSort: dataGetters.getAgeDefaultSort(),
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc'])
      },
      populationChangeChart: {
        getData: null,
      },
      employeeChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: d3.format(',d'),
      },
      employeePerCapitaChart: {
        getData: null,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: d3.format('.2f'),
      },
    }
  },

  mounted() {
    data.getData((err, allData) => {
      this.allData = allData

      this.foreignersChart.getData = dataGetters.getForeignerData(allData)
      this.welfareChart.getData = dataGetters.getWelfareData(allData)
      this.populationChangeChart.getData = dataGetters.getPopulationChangeData(allData)
      this.employeeChart.getData = dataGetters.getEmployeeData(allData)
      this.employeePerCapitaChart.getData = dataGetters.getEmployeePerCapitaData(allData)

      this.augmentedWealthGiniChart.getData = dataGetters.getAugmentedWealthGiniData(allData)
      this.wealthGiniChart.getData = dataGetters.getWealthGiniData(allData)
      this.medianWealthChart.getData = dataGetters.getMedianWealthData(allData)
      this.averageWealthChart.getData = dataGetters.getAverageWealthData(allData)

      this.augmentedIncomeGiniChart.getData = dataGetters.getAugmentedIncomeGiniData(allData)
      this.incomeGiniChart.getData = dataGetters.getIncomeGiniData(allData)
      this.medianIncomeChart.getData = dataGetters.getMedianIncomeData(allData)
      this.averageIncomeChart.getData = dataGetters.getAverageIncomeData(allData)

      this.citizenshipChart.getData = dataGetters.getCitizenshipData(allData)
      this.religionChart.getData = dataGetters.getReligionData(allData)
      this.ageChart.getData = dataGetters.getAgeData(allData)
    })
  },

  methods: {
  },

  components: {VueSlideUpDown},
})
