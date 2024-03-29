import {DISTRICTS, SETTINGS} from './common'
import async from 'async'
import * as d3 from 'd3'


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


export function getData(done) {
  async.reduce(DISTRICTS, {}, getDistrict, done)
}
