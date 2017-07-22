import * as d3 from 'd3'
import Vue from '../vue'
import * as data from '../data'
import {DISTRICT_NAMES} from '../common'
import * as dataGetters from '../data-getters'
import BarChart from '../bar-chart'
import RangeChart from '../range-chart'
import StackChart from '../stack-chart'
import * as colors from '../colors'


Vue.component('charts', {
  delimiters: ['${', '}'],
  template: '#component-template--charts',
  data: function() {
    return {
      locale: 'de',
    }
  },

  mounted() {
    data.getData((err, allData) => {
      let foreignersChart = new RangeChart({
        allData,
        selContainer: '#foreigners-chart',
        getGraphData: dataGetters.getForeignerData(allData),
        xLabel: 'Ausländeranteil',
        isPercent: true,
        colors: colors.GRAPHIQ3_12_LOWER,
      })

      let welfareChart = new RangeChart({
        allData,
        selContainer: '#welfare-chart',
        getGraphData: dataGetters.getWelfareData(allData),
        xLabel: 'Sozialhilfequote',
        isPercent: true,
        colors: colors.GRAPHIQ3_12_LOWER,
      })

      let medianWealthChart = new BarChart({
        allData,
        selContainer: '#median-wealth-chart',
        getGraphData: dataGetters.getMedianWealthData(allData),
        xLabel: 'Reinvermögen Median',
        colors: colors.GRAPHIQ3_12_LOWER,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: (d) => d3.format(',.0s')(d) + ' CHF',
      })

      let averageWealthChart = new BarChart({
        allData,
        selContainer: '#average-wealth-chart',
        getGraphData: dataGetters.getAverageWealthData(allData),
        xLabel: 'Reinvermögen Mittelwert',
        colors: colors.GRAPHIQ3_12_LOWER,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: (d) => d3.format(',.0s')(d) + ' CHF',
      })

      let medianIncomeChart = new BarChart({
        allData,
        selContainer: '#median-income-chart',
        getGraphData: dataGetters.getMedianIncomeData(allData),
        xLabel: 'Reineinkommen Median',
        colors: colors.GRAPHIQ3_12_LOWER,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: (d) => d3.format(',.0s')(d) + ' CHF',
      })

      let averageIncomeChart = new BarChart({
        allData,
        selContainer: '#average-income-chart',
        getGraphData: dataGetters.getAverageIncomeData(allData),
        xLabel: 'Reineinkommen Mittelwert',
        colors: colors.GRAPHIQ3_12_LOWER,
        xTickFormat: (d) => DISTRICT_NAMES[d],
        yTickFormat: (d) => d3.format(',.0s')(d) + ' CHF',
      })

      let citizenshipChart = new StackChart({
        allData,
        selContainer: '#citizenship-chart',
        getKeys: dataGetters.getCitizenshipKeys,
        getGraphData: dataGetters.getCitizenshipData(allData),
        xLabel: 'Teil',
        yLabel: 'Wohnviertel',
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc']),
      })

      let religionChart = new StackChart({
        allData,
        selContainer: '#religion-chart',
        getKeys: dataGetters.getReligionKeys,
        getGraphData: dataGetters.getReligionData(allData),
        xLabel: 'Teil',
        yLabel: 'Wohnviertel',
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
        defaultSort: dataGetters.getReligionDefaultSort(),
      })

      let ageChart = new StackChart({
        allData,
        selContainer: '#age-chart',
        getKeys: dataGetters.getAgeKeys,
        getGraphData: dataGetters.getAgeData(allData),
        xLabel: 'Teil',
        yLabel: 'Wohnviertel',
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc']),
        defaultSort: dataGetters.getAgeDefaultSort(),
      })
    })
  },

  methods: {
  },
})
