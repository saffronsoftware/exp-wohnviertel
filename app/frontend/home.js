import * as data from './data'
import {
  getCitizenshipData, getCitizenshipKeys,
  getReligionData, getReligionKeys, getReligionDefaultSort,
  getAgeData, getAgeKeys, getAgeDefaultSort,
} from './data-getters'
import Hero from './hero'
import BarChart from './bar-chart'
import RangeChart from './range-chart'
import StackChart from './stack-chart'
import * as colors from './colors'


data.getData((err, allData) => {
  let hero = new Hero({
    selContainer: '#hero',
  })

  let barChart = new BarChart({
    allData,
    selSvg: '#test-graph-1',
  })

  let rangeChart = new RangeChart({
    allData,
    selSvg: '#test-graph-2',
  })

  let citizenshipChart = new StackChart({
    allData,
    selSvg: '#citizenship-chart',
    getKeys: getCitizenshipKeys,
    getGraphData: getCitizenshipData(allData),
    xLabel: 'Teil',
    yLabel: 'Wohnviertel',
    colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc']),
  })

  let religionChart = new StackChart({
    allData,
    selSvg: '#religion-chart',
    getKeys: getReligionKeys,
    getGraphData: getReligionData(allData),
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
    defaultSort: getReligionDefaultSort(),
  })

  let ageChart = new StackChart({
    allData,
    selSvg: '#age-chart',
    getKeys: getAgeKeys,
    getGraphData: getAgeData(allData),
    xLabel: 'Teil',
    yLabel: 'Wohnviertel',
    colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc']),
    defaultSort: getAgeDefaultSort(),
  })
})
