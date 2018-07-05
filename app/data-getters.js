import {
  DISTRICTS, DISTRICT_NAMES,
  CITIZENSHIPS, CITIZENSHIPS_PREFIX, CITIZENSHIPS_OTHERS,
  CITIZENSHIPS_REDUCED, CITIZENSHIPS_NONREDUCED,
  RELIGIONS, RELIGIONS_PREFIX, RELIGIONS_DEFAULT_SORT,
  AGE_GROUPS, AGE_GROUPS_PREFIX,
  AGE_GROUPS_REDUCTION, AGE_GROUPS_REDUCED, AGE_GROUPS_DEFAULT_SORT,
} from './common'
import * as _ from 'lodash'

export function valueForDistrict(data, district) {
  return data.find((d) => d.district == district).value
}

export function rankForDistrict(data, district) {
  const sortedData = _.sortBy(data, (d) => d.value)
  return {
    rank: sortedData.findIndex((d) => d.district == district) + 1,
    outOf: data.length,
  }
}

export function getCitizenshipData(allData) {
  return function() {
    let year = '2016'
    const getKey = (item) => CITIZENSHIPS_PREFIX + item

    return DISTRICTS.map((district) => {
      let total = CITIZENSHIPS.reduce((total, citizenship) => {
        return total + allData[district][getKey(citizenship)][year]
      }, 0)

      let districtData = CITIZENSHIPS.reduce((districtData, citizenship) => {
        if (CITIZENSHIPS_REDUCED.includes(citizenship)) {
          return districtData
        }

        let rawDatum = allData[district][getKey(citizenship)][year]
        let proportionalDatum = rawDatum / total
        districtData[citizenship] = proportionalDatum

        if (citizenship == CITIZENSHIPS_OTHERS) {
          districtData[citizenship] += CITIZENSHIPS_REDUCED.reduce(
            (sum, redCitizenship) => {
              return sum + allData[district][getKey(redCitizenship)][year] / total
            }, 0
          )
        }

        return districtData
      }, {})

      districtData.total = total
      districtData.district = DISTRICT_NAMES[district]

      return districtData
    })
  }
}

export function getCitizenshipKeys() {
  return CITIZENSHIPS_NONREDUCED
}

export function getReligionData(allData) {
  return function() {
    let year = '2013'
    const getKey = (item) => RELIGIONS_PREFIX + item

    return DISTRICTS.map((district) => {
      let total = RELIGIONS.reduce((total, religion) => {
        return total + allData[district][getKey(religion)][year]
      }, 0)

      let districtData = RELIGIONS.reduce((districtData, religion) => {
        let rawDatum = allData[district][getKey(religion)][year]
        let proportionalDatum = rawDatum / total
        districtData[religion] = proportionalDatum
        return districtData
      }, {})

      districtData.total = total
      districtData.district = DISTRICT_NAMES[district]

      return districtData
    })
  }
}

export function getReligionKeys() {
  return RELIGIONS
}

export function getReligionDefaultSort() {
  return RELIGIONS_DEFAULT_SORT
}

export function getAgeData(allData) {
  return function() {
    const year = '2016'
    const getKey = (item) => AGE_GROUPS_PREFIX + item

    return DISTRICTS.map((district) => {
      let total = AGE_GROUPS.reduce((total, ageGroup) => {
        return total + allData[district][getKey(ageGroup)][year]
      }, 0)

      let districtData = AGE_GROUPS.reduce((districtData, ageGroup) => {
        let rawDatum = allData[district][getKey(ageGroup)][year]
        let proportionalDatum = rawDatum / total
        let reducedKey = AGE_GROUPS_REDUCTION[ageGroup]
        districtData[reducedKey] = districtData[reducedKey] || 0
        districtData[reducedKey] += proportionalDatum
        return districtData
      }, {})

      districtData.total = total
      districtData.district = DISTRICT_NAMES[district]

      return districtData
    })
  }
}

export function getAgeKeys() {
  return AGE_GROUPS_REDUCED
}

export function getAgeDefaultSort() {
  return AGE_GROUPS_DEFAULT_SORT
}

export function getForeignerData(allData) {
  return function() {
    const year = '2016'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value:
        allData[district]['Bevölkerung: Ausländer'][year] / (
          allData[district]['Bevölkerung: Ausländer'][year] +
          allData[district]['Bevölkerung: Schweizer'][year]
        ),
    }))
    return graphData
  }
}

export function getWelfareData(allData) {
  return function() {
    const year = '2016'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Sozialhilfequote'][year] / 100
    }))
    return graphData
  }
}

export function getMedianWealthData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reinvermögen Median'][year]
    }))
    return graphData
  }
}

export function getAverageWealthData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reinvermögen Mittelwert'][year]
    }))
    return graphData
  }
}

export function getMedianIncomeData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reineinkommen Median'][year]
    }))
    return graphData
  }
}

export function getAverageIncomeData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reineinkommen Mittelwert'][year]
    }))
    return graphData
  }
}

export function getPopulationChangeData(allData) {
  return function() {
    const year = '2015'
    const graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Wanderungen Saldo: Schweizer'][year] +
        allData[district]['Umzüge Saldo: Schweizer'][year] +
        allData[district]['Wanderungen Saldo: Ausländer'][year] +
        allData[district]['Umzüge Saldo: Ausländer'][year],
    }))
    return graphData
  }
}

export function getEmployeeData(allData) {
  return function() {
    const year = '2014'
    const graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Vollzeitäquivalente'][year],
    }))
    return graphData
  }
}
