import {DISTRICTS, SETTINGS} from './common'
import BarChart from './bar-chart'
import RangeChart from './range-chart'
import StackChart from './stack-chart'
import * as colors from './colors'
import {
  getCitizenshipData, getCitizenshipKeys,
  getReligionData, getReligionKeys, getReligionDefaultSort,
  getAgeData, getAgeKeys, getAgeDefaultSort,
} from './data-getters'
import * as d3 from 'd3'
import async from 'async'

function transformDistrictData(districtData) {
  return districtData.reduce((newData, datum) => {
    newData[datum['Name']] = datum
    return newData
  }, {})
}

function transformRow(row) {
  const numberKeys = [
    '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
    '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017',
  ]
  numberKeys.forEach((key) => {
    if (row[key].length == 0 || row[key] == '-') {
      row[key] = null
    } else {
      row[key] = +row[key]
    }
  })
  return row
}

function getDistrict(allData, district, done) {
  d3.csv(SETTINGS.csvPath + district + '.csv', transformRow, (districtData) => {
    allData[district] = transformDistrictData(districtData)
    done(null, allData)
  })
}

function getData(done) {
  async.reduce(DISTRICTS, {}, getDistrict, done)
}

getData((err, allData) => {
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
