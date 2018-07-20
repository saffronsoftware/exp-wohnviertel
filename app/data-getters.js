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
  const rank = data.length - sortedData.findIndex((d) => d.district == district)
  return {
    rank: rank,
    outOf: data.length,
    rawRank: rank / data.length,
    rankForPartitions: (n) => Math.ceil(rank / data.length * n),
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

export function getWealthGiniData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reinvermögen Gini'][year]
    }))
    return graphData
  }
}

/*
SOURCE:
https://www.credit-suisse.com/corporate/en/research/research-institute/global-wealth-report.html
2017
*/
export function getAugmentedWealthGiniData(allData) {
  return function() {
    const standardData = getWealthGiniData(allData)()
    const extraData = [
      {isFake: true, name: 'Deutschland', value: 0.771},
      {isFake: true, name: 'Frankreich', value: 0.697},
      {isFake: true, name: 'Island', value: 0.684},
      {isFake: true, name: 'Italien', value: 0.661},
      {isFake: true, name: 'Japan', value: 0.634},
      {isFake: true, name: 'Schweden', value: 0.794},
      {isFake: true, name: 'Schweiz', value: 0.802},
      {isFake: true, name: 'UK', value: 0.682},
      {isFake: true, name: 'USA', value: 0.846},
      {isFake: true, name: 'Ukraine', value: 0.919},
      {isFake: true, name: 'Welt', value: 0.911},
      {isFake: true, name: 'Ägypten', value: 0.807},
      {isFake: true, name: 'Österreich', value: 0.779},
    ]
    return standardData.concat(extraData)
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

export function getIncomeGiniData(allData) {
  return function() {
    const year = '2014'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Geld: Reineinkommen Gini'][year]
    }))
    return graphData
  }
}

/*
SOURCE:
https://www.gut-leben-in-deutschland.de/static/LB/indicators/income/gini-coefficient-income/
2014
*/
export function getAugmentedIncomeGiniData(allData) {
  return function() {
    const standardData = getIncomeGiniData(allData)()
    const extraData = [
      {isFake: true, name: 'Island', value: 0.25},
      {isFake: true, name: 'Schweden', value: 0.27},
      {isFake: true, name: 'Österreich', value: 0.27},
      {isFake: true, name: 'Deutschland', value: 0.29},
      {isFake: true, name: 'Frankreich', value: 0.30},
      {isFake: true, name: 'Schweiz', value: 0.30},
      {isFake: true, name: 'Italien', value: 0.33},
      {isFake: true, name: 'UK', value: 0.36},
      {isFake: true, name: 'USA', value: 0.39},
      {isFake: true, name: 'Türkei', value: 0.40},
      {isFake: true, name: 'Mexiko', value: 0.46},
      {isFake: true, name: 'Costa Rica', value: 0.49},
    ]
    return standardData.concat(extraData)
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
      value: allData[district]['Vollzeitäquivalente'][year]
    }))
    return graphData
  }
}

export function getEmployeePerCapitaData(allData) {
  return function() {
    const year = '2014'
    const graphData = DISTRICTS.map((district) => ({
      district: district,
      value: allData[district]['Vollzeitäquivalente'][year] /
        (
          allData[district]['Bevölkerung: Ausländer'][year] +
          allData[district]['Bevölkerung: Schweizer'][year]
        )
    }))
    return graphData
  }
}
