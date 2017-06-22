import {
  DISTRICTS, DISTRICT_NAMES,
  CITIZENSHIPS, CITIZENSHIPS_PREFIX, CITIZENSHIPS_OTHERS,
  CITIZENSHIPS_REDUCED, CITIZENSHIPS_NONREDUCED,
  RELIGIONS, RELIGIONS_PREFIX,
  AGE_GROUPS, AGE_GROUPS_PREFIX,
} from './common'
import * as _ from 'lodash'

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

export function getAgeData(allData) {
  return function() {
    let year = '2016'
    const getKey = (item) => AGE_GROUPS_PREFIX + item

    return DISTRICTS.map((district) => {
      let total = AGE_GROUPS.reduce((total, ageGroup) => {
        return total + allData[district][getKey(ageGroup)][year]
      }, 0)

      let districtData = AGE_GROUPS.reduce((districtData, ageGroup) => {
        let rawDatum = allData[district][getKey(ageGroup)][year]
        let proportionalDatum = rawDatum / total
        districtData[ageGroup] = proportionalDatum
        return districtData
      }, {})

      districtData.total = total
      districtData.district = DISTRICT_NAMES[district]

      return districtData
    })
  }
}

export function getAgeKeys() {
  return AGE_GROUPS
}
