import * as _ from 'lodash'

export const DISTRICTS = [
  'altstadt-grossbasel',
  'altstadt-kleinbasel',
  'am-ring',
  'bachletten',
  'bettingen',
  'breite',
  'bruderholz',
  'clara',
  'gotthelf',
  'gundeldingen',
  'hirzbrunnen',
  'iselin',
  'kleinhüningen',
  'klybeck',
  'matthäus',
  'riehen',
  'rosental',
  'st-alban',
  'st-johann',
  'vorstädte',
  'wettstein',
]

export const DISTRICT_NAMES = {
  'altstadt-grossbasel': 'Altstadt Grossbasel',
  'altstadt-kleinbasel': 'Altstadt Kleinbasel',
  'am-ring': 'Am Ring',
  'bachletten': 'Bachletten',
  'bettingen': 'Bettingen',
  'breite': 'Breite',
  'bruderholz': 'Bruderholz',
  'clara': 'Clara',
  'gotthelf': 'Gotthelf',
  'gundeldingen': 'Gundeldingen',
  'hirzbrunnen': 'Hirzbrunnen',
  'iselin': 'Iselin',
  'kleinhüningen': 'Kleinhüningen',
  'klybeck': 'Klybeck',
  'matthäus': 'Matthäus',
  'riehen': 'Riehen',
  'rosental': 'Rosental',
  'st-alban': 'St. Alban',
  'st-johann': 'St. Johann',
  'vorstädte': 'Vorstädte',
  'wettstein': 'Wettstein',
}

export const MEASUREMENTS = [
  'Bevölkerung: Schweizer',
  'Bevölkerung: Ausländer',
  'Fläche: Zonen S-6',
  'Fläche: Zonen S-7',
  'Fläche: Gesamt',
  'Wanderungen Saldo: Schweizer',
  'Umzüge Saldo: Schweizer',
  'Wanderungen Saldo: Ausländer',
  'Umzüge Saldo: Ausländer',
  'Alter: 0-4',
  'Alter: 5-9',
  'Alter: 10-14',
  'Alter: 15-19',
  'Alter: 20-24',
  'Alter: 25-29',
  'Alter: 30-34',
  'Alter: 35-39',
  'Alter: 40-44',
  'Alter: 45-49',
  'Alter: 50-54',
  'Alter: 55-59',
  'Alter: 60-64',
  'Alter: 65-69',
  'Alter: 70-74',
  'Alter: 75-79',
  'Alter: 80-84',
  'Alter: 85-89',
  'Alter: 90-94',
  'Alter: 95-99',
  'Alter: 100-104',
  'Alter: 105-109',
  'Alter: 110-114',
  'Staatsangehörigkeit: Deutschland',
  'Staatsangehörigkeit: Italien',
  'Staatsangehörigkeit: Türkei',
  'Staatsangehörigkeit: Serbien, Montenegro, Kosovo',
  'Staatsangehörigkeit: Spanien',
  'Staatsangehörigkeit: Portugal',
  'Staatsangehörigkeit: Mazedonien',
  'Staatsangehörigkeit: Vereinigtes Königreich',
  'Staatsangehörigkeit: Frankreich',
  'Staatsangehörigkeit: Indien',
  'Staatsangehörigkeit: Vereinigte Staaten von Amerika',
  'Staatsangehörigkeit: Österreich',
  'Staatsangehörigkeit: Kroatien',
  'Staatsangehörigkeit: Sri Lanka',
  'Staatsangehörigkeit: Polen',
  'Staatsangehörigkeit: Übriges Ausland',
  'Religion: Keine Zugehörigkeit',
  'Religion: Protestantisch',
  'Religion: Römisch-katolisch',
  'Religion: Christ-katolisch',
  'Religion: Ostkirchliche Religionsgemeinde',
  'Religion: Jüdisch',
  'Religion: Muslimisch',
  'Religion: Andere',
  'Religion: Keine Angabe',
  'Vollzeitäquivalente',
  'Sozialhilfequote',
  'Geld: Veranlagungen',
  'Geld: Reineinkommen Mittelwert',
  'Geld: Reineinkommen Median',
  'Geld: Reineinkommen Gini',
  'Geld: Einkommensteuer Mittelwert',
  'Geld: Einkommensteuer Median',
  'Geld: Einkommensteuer Summe',
  'Geld: Steuerbelastung des Reineinkommens',
  'Geld: Reinvermögen Mittelwert',
  'Geld: Reinvermögen Median',
  'Geld: Reinvermögen Gini',
  'Geld: Vermögenssteuer Mittelwert',
  'Geld: Vermögenssteuer Median',
  'Geld: Vermögenssteuer Summe',
  'Geld: Steuerbelastung des Reinvermögens',
]

export const AGE_GROUPS_PREFIX = 'Alter: '

export const AGE_GROUPS = MEASUREMENTS
  .filter((d) => d.indexOf(AGE_GROUPS_PREFIX) == 0)
  .map((d) => d.replace(AGE_GROUPS_PREFIX, ''))

export const AGE_GROUPS_REDUCTION = {
  '0-4': '0-9',
  '5-9': '0-9',
  '10-14': '10-19',
  '15-19': '10-19',
  '20-24': '20-29',
  '25-29': '20-29',
  '30-34': '30-39',
  '35-39': '30-39',
  '40-44': '40-49',
  '45-49': '40-49',
  '50-54': '50-59',
  '55-59': '50-59',
  '60-64': '60-69',
  '65-69': '60-69',
  '70-74': '70-89',
  '75-79': '70-89',
  '80-84': '70-89',
  '85-89': '70-89',
  '90-94': '90-114',
  '95-99': '90-114',
  '100-104': '90-114',
  '105-109': '90-114',
  '110-114': '90-114',
}

export const AGE_GROUPS_REDUCED = _.uniq(_.values(AGE_GROUPS_REDUCTION))

export const AGE_GROUPS_DEFAULT_SORT = '0-9'

export const CITIZENSHIPS_PREFIX = 'Staatsangehörigkeit: '

export const CITIZENSHIPS_OTHERS = 'Übriges Ausland'

export const CITIZENSHIPS_REDUCED = [
  'Kroatien', 'Sri Lanka', 'Polen',
]

export const CITIZENSHIPS = MEASUREMENTS
  .filter((d) => d.indexOf(CITIZENSHIPS_PREFIX) == 0)
  .map((d) => d.replace(CITIZENSHIPS_PREFIX, ''))

export const CITIZENSHIPS_NONREDUCED = _.difference(CITIZENSHIPS, CITIZENSHIPS_REDUCED)

export const RELIGIONS_PREFIX = 'Religion: '

export const RELIGIONS = MEASUREMENTS
  .filter((d) => d.indexOf(RELIGIONS_PREFIX) == 0)
  .map((d) => d.replace(RELIGIONS_PREFIX, ''))

export const RELIGIONS_DEFAULT_SORT = 'Keine Zugehörigkeit'

export const SETTINGS = {
  csvPath: '/data/',
}
