(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

require('./components/hero');

require('./components/page');

require('./components/range-chart');

require('./components/bar-chart');

require('./components/stack-chart');

require('./components/map-chart');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


new _vue2.default({ el: '#page-container' });
});

;require.register("colors.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GRAPHIQ3_12 = exports.GRAPHIQ3_12 = ['#2D0F41', '#3D1459', '#4D1A70', '#5E1F88', '#742796', '#973490', '#B8428C', '#DB5087', '#E96A8D', '#EE8B96', '#F3ACA2', '#F9CEAC'];

var GRAPHIQ3_12_LOWER = exports.GRAPHIQ3_12_LOWER = ['#ffe8b1', '#fdd1a6', '#fdc09f', '#fca998', '#f9888f', '#f16588', '#e14985', '#c2368f', '#9d299a', '#751e9a', '#641996', '#390d62'];

var GRAPHIQ3_12_HIGHS = exports.GRAPHIQ3_12_HIGHS = ['#fdcda4', '#fdc2a0', '#fdbc9e', '#fdb99d', '#fcb19b', '#fca998', '#fca597', '#fb9d95', '#fa9593'];
});

;require.register("common.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETTINGS = exports.RELIGIONS_DEFAULT_SORT = exports.RELIGIONS = exports.RELIGIONS_PREFIX = exports.CITIZENSHIPS_NONREDUCED = exports.CITIZENSHIPS = exports.CITIZENSHIPS_REDUCED = exports.CITIZENSHIPS_OTHERS = exports.CITIZENSHIPS_PREFIX = exports.AGE_GROUPS_DEFAULT_SORT = exports.AGE_GROUPS_REDUCED = exports.AGE_GROUPS_REDUCTION = exports.AGE_GROUPS = exports.AGE_GROUPS_PREFIX = exports.MEASUREMENTS = exports.DISTRICT_NAMES = exports.DISTRICTS = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DISTRICTS = exports.DISTRICTS = ['altstadt-grossbasel', 'altstadt-kleinbasel', 'am-ring', 'bachletten', 'bettingen', 'breite', 'bruderholz', 'clara', 'gotthelf', 'gundeldingen', 'hirzbrunnen', 'iselin', 'kleinhüningen', 'klybeck', 'matthäus', 'riehen', 'rosental', 'st-alban', 'st-johann', 'vorstädte', 'wettstein'];

var DISTRICT_NAMES = exports.DISTRICT_NAMES = {
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
  'wettstein': 'Wettstein'
};

var MEASUREMENTS = exports.MEASUREMENTS = ['Bevölkerung: Schweizer', 'Bevölkerung: Ausländer', 'Fläche: Zonen S-6', 'Fläche: Zonen S-7', 'Fläche: Gesamt', 'Wanderungen Saldo: Schweizer', 'Umzüge Saldo: Schweizer', 'Wanderungen Saldo: Ausländer', 'Umzüge Saldo: Ausländer', 'Alter: 0-4', 'Alter: 5-9', 'Alter: 10-14', 'Alter: 15-19', 'Alter: 20-24', 'Alter: 25-29', 'Alter: 30-34', 'Alter: 35-39', 'Alter: 40-44', 'Alter: 45-49', 'Alter: 50-54', 'Alter: 55-59', 'Alter: 60-64', 'Alter: 65-69', 'Alter: 70-74', 'Alter: 75-79', 'Alter: 80-84', 'Alter: 85-89', 'Alter: 90-94', 'Alter: 95-99', 'Alter: 100-104', 'Alter: 105-109', 'Alter: 110-114', 'Staatsangehörigkeit: Deutschland', 'Staatsangehörigkeit: Italien', 'Staatsangehörigkeit: Türkei', 'Staatsangehörigkeit: Serbien, Montenegro, Kosovo', 'Staatsangehörigkeit: Spanien', 'Staatsangehörigkeit: Portugal', 'Staatsangehörigkeit: Mazedonien', 'Staatsangehörigkeit: Vereinigtes Königreich', 'Staatsangehörigkeit: Frankreich', 'Staatsangehörigkeit: Indien', 'Staatsangehörigkeit: Vereinigte Staaten von Amerika', 'Staatsangehörigkeit: Österreich', 'Staatsangehörigkeit: Kroatien', 'Staatsangehörigkeit: Sri Lanka', 'Staatsangehörigkeit: Polen', 'Staatsangehörigkeit: Übriges Ausland', 'Religion: Keine Zugehörigkeit', 'Religion: Protestantisch', 'Religion: Römisch-katolisch', 'Religion: Christ-katolisch', 'Religion: Ostkirchliche Religionsgemeinde', 'Religion: Jüdisch', 'Religion: Muslimisch', 'Religion: Andere', 'Religion: Keine Angabe', 'Vollzeitäquivalente', 'Sozialhilfequote', 'Geld: Veranlagungen', 'Geld: Reineinkommen Mittelwert', 'Geld: Reineinkommen Median', 'Geld: Reineinkommen Gini', 'Geld: Einkommensteuer Mittelwert', 'Geld: Einkommensteuer Median', 'Geld: Einkommensteuer Summe', 'Geld: Steuerbelastung des Reineinkommens', 'Geld: Reinvermögen Mittelwert', 'Geld: Reinvermögen Median', 'Geld: Reinvermögen Gini', 'Geld: Vermögenssteuer Mittelwert', 'Geld: Vermögenssteuer Median', 'Geld: Vermögenssteuer Summe', 'Geld: Steuerbelastung des Reinvermögens'];

var AGE_GROUPS_PREFIX = exports.AGE_GROUPS_PREFIX = 'Alter: ';

var AGE_GROUPS = exports.AGE_GROUPS = MEASUREMENTS.filter(function (d) {
  return d.indexOf(AGE_GROUPS_PREFIX) == 0;
}).map(function (d) {
  return d.replace(AGE_GROUPS_PREFIX, '');
});

var AGE_GROUPS_REDUCTION = exports.AGE_GROUPS_REDUCTION = {
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
  '70-74': '70-99',
  '75-79': '70-99',
  '80-84': '70-99',
  '85-89': '70-99',
  '90-94': '90-114',
  '95-99': '90-114',
  '100-104': '90-114',
  '105-109': '90-114',
  '110-114': '90-114'
};

var AGE_GROUPS_REDUCED = exports.AGE_GROUPS_REDUCED = _.uniq(_.values(AGE_GROUPS_REDUCTION));

var AGE_GROUPS_DEFAULT_SORT = exports.AGE_GROUPS_DEFAULT_SORT = '0-9';

var CITIZENSHIPS_PREFIX = exports.CITIZENSHIPS_PREFIX = 'Staatsangehörigkeit: ';

var CITIZENSHIPS_OTHERS = exports.CITIZENSHIPS_OTHERS = 'Übriges Ausland';

var CITIZENSHIPS_REDUCED = exports.CITIZENSHIPS_REDUCED = ['Kroatien', 'Sri Lanka', 'Polen'];

var CITIZENSHIPS = exports.CITIZENSHIPS = MEASUREMENTS.filter(function (d) {
  return d.indexOf(CITIZENSHIPS_PREFIX) == 0;
}).map(function (d) {
  return d.replace(CITIZENSHIPS_PREFIX, '');
});

var CITIZENSHIPS_NONREDUCED = exports.CITIZENSHIPS_NONREDUCED = _.difference(CITIZENSHIPS, CITIZENSHIPS_REDUCED);

var RELIGIONS_PREFIX = exports.RELIGIONS_PREFIX = 'Religion: ';

var RELIGIONS = exports.RELIGIONS = MEASUREMENTS.filter(function (d) {
  return d.indexOf(RELIGIONS_PREFIX) == 0;
}).map(function (d) {
  return d.replace(RELIGIONS_PREFIX, '');
});

var RELIGIONS_DEFAULT_SORT = exports.RELIGIONS_DEFAULT_SORT = 'Keine Zugehörigkeit';

var SETTINGS = exports.SETTINGS = {
  csvPath: '/data/'
};
});

;require.register("components/bar-chart.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('bar-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--bar-chart',
  props: ['allData', 'getGraphData', 'xLabel', 'yLabel', 'colors', 'xTickFormat', 'yTickFormat'],
  data: function data() {
    return {};
  },

  mounted: function mounted() {
    var elSvg = this.$el.querySelector('svg');
    var elSvgDims = elSvg.getBoundingClientRect();
    var svg = d3.select(elSvg);
    var margins = {
      top: 20,
      right: 25,
      bottom: 80,
      left: 70
    };

    this.width = elSvgDims.width - margins.left - margins.right;
    this.height = elSvgDims.height - margins.top - margins.bottom;

    this.g = svg.append('g').attr('transform', 'translate(' + margins.left + ', ' + margins.right + ')');

    this.x = d3.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl);

    this.graphData = [];

    this.makeGraphData();
    this.draw();
  },


  methods: {
    makeGraphData: function makeGraphData() {
      // NOTE: It is very important that data is sorted, for colors to work.
      this.graphData = _.sortBy(this.getGraphData(), function (d) {
        return d.value;
      });
      this.updateAxes();
    },
    updateAxes: function updateAxes() {
      var graphDataValues = this.graphData.map(function (d) {
        return d.value;
      });
      this.x.domain(this.graphData.map(function (d) {
        return d.district;
      }));
      this.y.domain([0, d3.max(graphDataValues)]);
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length));
    },
    draw: function draw() {
      var _this = this;

      var bottomAxis = d3.axisBottom(this.x);

      if (this.xTickFormat) {
        bottomAxis = bottomAxis.tickFormat(this.xTickFormat);
      }

      this.g.selectAll('.axis.axis--x').remove();
      var xAxis = this.g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0, ' + this.height + ')').call(bottomAxis);
      xAxis.selectAll('text').attr('transform', 'rotate(30)').attr('text-anchor', 'start');
      xAxis.append('text').attr('transform', 'translate(' + this.width + ') rotate(90)').attr('dy', '-0.8rem').attr('text-anchor', 'end').text(this.xLabel);

      var leftAxis = d3.axisLeft(this.y).ticks(10);
      if (this.yTickFormat) {
        leftAxis = leftAxis.tickFormat(this.yTickFormat);
      }

      this.g.selectAll('.axis.axis--y').remove();
      this.g.append('g').attr('class', 'axis axis--y').call(leftAxis).append('text').attr('transform', 'rotate(90)').attr('dx', '3rem').attr('dy', '-0.6rem').attr('text-anchor', 'end').text(this.yLabel);

      var bars = this.g.selectAll('.bar').data(this.graphData);

      bars.exit().remove();

      bars.enter().append('rect').attr('class', 'bar').attr('x', function (d) {
        return _this.x(d.district);
      }).attr('y', function (d) {
        return _this.y(d.value);
      }).attr('width', this.x.bandwidth()).attr('height', function (d) {
        return _this.height - _this.y(d.value);
      }).attr('fill', function (d) {
        return _this.color(d.value);
      });
    }
  }
});
});

;require.register("components/hero.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _heroScene = require('../hero-scene');

var _heroScene2 = _interopRequireDefault(_heroScene);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('hero', {
  delimiters: ['${', '}'],
  template: '#component-template--hero',
  props: ['locale'],
  data: function data() {
    return {};
  },

  mounted: function mounted() {
    var hero = new _heroScene2.default({
      selContainer: '#hero-scene'
    });
  },


  methods: {}
});
});

;require.register("components/map-chart.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _common = require('../common');

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('map-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--map-chart',
  props: ['allData', 'getGraphData', 'colors'],
  data: function data() {
    return {};
  },

  mounted: function mounted() {
    this.svg = d3.select(Dom(this.$el).find('svg').elem());
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl);
    this.makeGraphData();
    this.draw();
  },


  methods: {
    makeGraphData: function makeGraphData() {
      this.graphData = _.sortBy(this.getGraphData(), function (d) {
        return d.value;
      });
      this.updateAxes();
    },
    updateAxes: function updateAxes() {
      var graphDataValues = this.graphData.map(function (d) {
        return d.value;
      });
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length));
    },
    draw: function draw() {
      var _this = this;

      var makeKey = function makeKey(d) {
        if (d) {
          return d.district;
        } else {
          return this.getAttribute('data-name');
        }
      };
      this.svg.selectAll('[data-name="wohnviertel"] polygon').data(this.graphData, makeKey).attr('fill', function (d) {
        return _this.color(d.value);
      });
    }
  }
});
});

;require.register("components/page.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _data = require('../data');

var data = _interopRequireWildcard(_data);

var _common = require('../common');

var _dataGetters = require('../data-getters');

var dataGetters = _interopRequireWildcard(_dataGetters);

var _colors = require('../colors');

var colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('page', {
  delimiters: ['${', '}'],
  template: '#component-template--page',
  data: function data() {
    return {
      allData: null,
      colors: colors,
      foreignersChart: {
        getData: null
      },
      welfareChart: {
        getData: null
      },
      medianWealthChart: {
        getData: null,
        xTickFormat: function xTickFormat(d) {
          return _common.DISTRICT_NAMES[d];
        },
        yTickFormat: function yTickFormat(d) {
          return d3.format(',.0s')(d) + ' CHF';
        }
      },
      averageWealthChart: {
        getData: null,
        xTickFormat: function xTickFormat(d) {
          return _common.DISTRICT_NAMES[d];
        },
        yTickFormat: function yTickFormat(d) {
          return d3.format(',.0s')(d) + ' CHF';
        }
      },
      medianIncomeChart: {
        getData: null,
        xTickFormat: function xTickFormat(d) {
          return _common.DISTRICT_NAMES[d];
        },
        yTickFormat: function yTickFormat(d) {
          return d3.format(',.0s')(d) + ' CHF';
        }
      },
      averageIncomeChart: {
        getData: null,
        xTickFormat: function xTickFormat(d) {
          return _common.DISTRICT_NAMES[d];
        },
        yTickFormat: function yTickFormat(d) {
          return d3.format(',.0s')(d) + ' CHF';
        }
      },
      citizenshipChart: {
        getData: null,
        getKeys: dataGetters.getCitizenshipKeys,
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc'])
      },
      religionChart: {
        getData: null,
        getKeys: dataGetters.getReligionKeys,
        defaultSort: dataGetters.getReligionDefaultSort(),
        colors: [colors.GRAPHIQ3_12_LOWER[0], colors.GRAPHIQ3_12_LOWER[2], colors.GRAPHIQ3_12_LOWER[3], colors.GRAPHIQ3_12_LOWER[5], colors.GRAPHIQ3_12_LOWER[7], colors.GRAPHIQ3_12_LOWER[9], colors.GRAPHIQ3_12_LOWER[11], '#aaaaaa', '#cccccc']
      },
      ageChart: {
        getData: null,
        getKeys: dataGetters.getAgeKeys,
        defaultSort: dataGetters.getAgeDefaultSort(),
        colors: colors.GRAPHIQ3_12_LOWER.concat(['#cccccc'])
      }
    };
  },

  mounted: function mounted() {
    var _this = this;

    data.getData(function (err, allData) {
      _this.allData = allData;
      _this.foreignersChart.getData = dataGetters.getForeignerData(allData);
      _this.welfareChart.getData = dataGetters.getWelfareData(allData);
      _this.medianWealthChart.getData = dataGetters.getMedianWealthData(allData);
      _this.averageWealthChart.getData = dataGetters.getAverageWealthData(allData);
      _this.medianIncomeChart.getData = dataGetters.getMedianIncomeData(allData);
      _this.averageIncomeChart.getData = dataGetters.getAverageIncomeData(allData);
      _this.citizenshipChart.getData = dataGetters.getCitizenshipData(allData);
      _this.religionChart.getData = dataGetters.getReligionData(allData);
      _this.ageChart.getData = dataGetters.getAgeData(allData);
    });
  },


  methods: {}
});
});

;require.register("components/range-chart.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _common = require('../common');

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('range-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--range-chart',
  props: ['allData', 'getGraphData', 'xLabel', 'colors', 'isPercent', 'tickFormat'],
  data: function data() {
    return {};
  },

  mounted: function mounted() {
    var elSvg = this.$el.querySelector('svg');
    var elSvgDims = elSvg.getBoundingClientRect();
    var svg = d3.select(elSvg);
    var margins = {
      top: 0,
      right: 5,
      bottom: 30,
      left: 5
    };

    this.width = elSvgDims.width - margins.left - margins.right;
    this.height = elSvgDims.height - margins.top - margins.bottom;

    this.g = svg.append('g').attr('transform', 'translate(' + margins.left + ', ' + margins.right + ')');

    this.x = d3.scaleLinear().range([0, this.width]);
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl);

    this.graphData = [];

    this.makeGraphData();
    this.draw();
  },


  methods: {
    makeGraphData: function makeGraphData() {
      // NOTE: It is very important that data is sorted, for `fixCollisions()`
      // and colors to work.
      this.graphData = _.sortBy(this.getGraphData(), function (d) {
        return d.value;
      });
      this.updateAxes();
    },
    updateAxes: function updateAxes() {
      var graphDataValues = this.graphData.map(function (d) {
        return d.value;
      });
      var PADDING_FACTOR = 10;
      var PADDING_MIN_FACTOR = 0.5;
      var PADDING_MAX_FACTOR = 1.5;
      var min = d3.min(graphDataValues);
      var max = d3.max(graphDataValues);
      var padding = (max - min) / PADDING_FACTOR;
      this.x.domain([min - padding * PADDING_MIN_FACTOR, max + padding * PADDING_MAX_FACTOR]);
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length));
    },
    fixCollisions: function fixCollisions(nodes) {
      var NR_ITERATIONS = 200;
      var MIN_DIST = 22; // px
      var FORCE_FACTOR = 10;
      var FORCE = MIN_DIST / FORCE_FACTOR;
      function doFixCollisions(d) {
        var curr = d3.select(this);
        var prev = d3.select(this.previousElementSibling);
        if (!prev.empty() && prev.classed('range-node')) {
          if (Math.abs(prev.attr('x') - curr.attr('x')) < MIN_DIST) {
            prev.attr('x', prev.attr('x') - FORCE);
          }
        }
      }
      _.times(NR_ITERATIONS, function () {
        nodes.each(doFixCollisions);
      });
    },
    draw: function draw() {
      var _this = this;

      this.g.selectAll('.axis.axis--x').remove();

      var bottomAxis = d3.axisBottom(this.x).ticks(10, this.isPercent ? '%' : undefined);

      if (this.tickFormat) {
        bottomAxis = bottomAxis.tickFormat(this.tickFormat);
      }

      this.g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0, ' + this.height + ')').call(bottomAxis).append('text').attr('x', this.width).attr('dy', '-0.6rem').attr('text-anchor', 'end').text(this.xLabel);

      var nodes = this.g.selectAll('.range-node').data(this.graphData);

      nodes.exit().remove();

      nodes = nodes.enter().append('svg').attr('class', 'range-node').attr('x', function (d) {
        return _this.x(d.value);
      }).attr('y', this.height - 20);
      nodes.append('circle').attr('class', 'circle').attr('r', 10).attr('fill', function (d) {
        return _this.color(d.value);
      });
      nodes.append('text').text(function (d) {
        return _common.DISTRICT_NAMES[d.district];
      }).attr('dx', '1.0rem').attr('dy', '0.2rem').attr('text-anchor', 'left').attr('transform', 'rotate(-60)');

      this.fixCollisions(nodes);
    }
  }
});
});

;require.register("components/stack-chart.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _util = require('../util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);


_vue2.default.component('stack-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--stack-chart',
  props: ['allData', 'getGraphData', 'getKeys', 'xLabel', 'yLabel', 'colors', 'defaultSort'],
  data: function data() {
    return {
      factoryDefaultSort: 'district'
    };
  },

  mounted: function mounted() {
    var elSvg = this.$el.querySelector('svg');
    var elSvgDims = elSvg.getBoundingClientRect();
    var svg = d3.select(elSvg);
    var margins = {
      top: 30,
      right: 5,
      bottom: 40,
      left: 130,
      legend: 200
    };

    this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'));

    this.width = elSvgDims.width - margins.left - margins.right;
    this.height = elSvgDims.height - margins.top - margins.bottom;
    this.graphWidth = this.width - margins.legend;

    this.g = svg.append('g').attr('transform', 'translate(' + margins.left + ', ' + margins.right + ')');
    this.graphData = [];

    this.x = d3.scaleLinear().rangeRound([0, this.graphWidth]);
    this.y = d3.scaleBand().rangeRound([0, this.height]).padding(0.1);
    this.z = d3.scaleOrdinal().range(this.colors);

    this.isFocused = false;
    this.sortingProperty = this.defaultSort || this.factoryDefaultSort;
    this.tooltipsEnabled = true;

    this.makeGraphData();
    this.draw();
  },


  methods: {
    makeGraphData: function makeGraphData() {
      this.graphData = this.getGraphData();
      this.stackKeys = this.getKeys();
      this.updateAxes();
    },
    updateAxes: function updateAxes() {
      var _this = this;

      this.x.domain([0, 1]);
      this.y.domain(_.sortBy(this.graphData, function (d) {
        return d[_this.sortingProperty];
      }).map(function (d) {
        return d.district;
      }));
      this.z.domain(this.stackKeys);
    },
    drawAxes: function drawAxes() {
      this.g.selectAll('.axis.axis--x').remove();
      var xAxis = this.g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0, ' + this.height + ')').call(d3.axisBottom(this.x).ticks(10, '%'));
      xAxis.selectAll('text').attr('transform', 'rotate(30)').attr('text-anchor', 'start');
      xAxis.append('text').attr('transform', 'translate(' + this.graphWidth + ')').attr('dx', '0').attr('dy', '2.2rem').attr('text-anchor', 'end').text(this.xLabel);

      this.g.selectAll('.axis.axis--y').remove();
      this.g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(this.y)).append('text').attr('dx', '0rem').attr('dy', '-0.8rem').attr('text-anchor', 'end').text(this.yLabel);
    },
    drawLegend: function drawLegend() {
      this.g.selectAll('.legend').remove();
      var legend = this.g.append('g').attr('class', 'legend').attr('text-anchor', 'end').attr('y', 0).selectAll('g').data(this.stackKeys).enter().append('g').attr('transform', function (d, i) {
        return 'translate(0, ' + i * 25 + ')';
      });

      legend.append('rect').attr('x', this.width - 20).attr('width', 20).attr('height', 20).attr('fill', this.z);

      legend.append('text').attr('y', 10).attr('dy', '0.35rem').attr('transform', 'translate(' + (this.width - 33) + ') rotate(-30)').attr('text-anchor', 'end').text(function (d) {
        return d;
      });
    },
    getAllBars: function getAllBars() {
      return this.g.selectAll('.bar-group').data(d3.stack().keys(this.stackKeys)(this.graphData)).selectAll('.bar').data(function (d) {
        return d;
      });
    },
    getFocusedBars: function getFocusedBars() {
      return d3.selectAll('.bar-group.bar-group--focused .bar');
    },
    zeroBarX: function zeroBarX(bars) {
      return bars.transition().duration(400).attr('x', 0);
    },
    updateBarX: function updateBarX(bars) {
      var _this2 = this;

      return bars.transition().duration(400).attr('x', function (d) {
        return _this2.x(d[0]);
      });
    },
    updateBarY: function updateBarY(bars) {
      var _this3 = this;

      return bars.transition().duration(400).attr('y', function (d) {
        return _this3.y(d.data.district);
      });
    },
    hideUnfocusedBars: function hideUnfocusedBars() {
      d3.selectAll('.bar-group:not(.bar-group--focused)').classed('bar-group--hidden', true).transition().duration(200).style('opacity', 0);
    },
    showAllBars: function showAllBars() {
      d3.selectAll('.bar-group').classed('bar-group--hidden', false).transition().duration(400).style('opacity', 1);
    },
    focusBar: function focusBar(el) {
      this.isFocused = true;
      var barGroup = el.parentNode;
      var parentDatum = d3.select(barGroup).datum();
      this.sortingProperty = parentDatum.key;

      d3.select(barGroup).classed('bar-group--focused', true);

      this.hideUnfocusedBars();
      this.updateAxes();
      this.drawAxes();
      this.updateBarY(this.zeroBarX(this.getFocusedBars()));
    },
    unfocusBar: function unfocusBar() {
      var _this4 = this;

      this.isFocused = false;
      this.tooltipsEnabled = false;
      this.sortingProperty = this.defaultSort || this.factoryDefaultSort;

      d3.select('.bar-group--focused').classed('bar-group--focused', false);

      this.updateAxes();
      this.drawAxes();
      this.updateBarX(this.updateBarY(this.getAllBars()));
      setTimeout(function () {
        _this4.tooltipsEnabled = true;
        _this4.showAllBars();
      }, 800);
    },
    showTooltip: function showTooltip(el, d) {
      if (!this.tooltipsEnabled) {
        return;
      }
      var rect = el.getBoundingClientRect();
      var barMid = (this.x(d[1]) - this.x(d[0])) / 2;
      var left = rect.left + window.scrollX + barMid;
      var top = rect.top + window.scrollY;
      var barGroup = el.parentNode;
      var parentDatum = d3.select(barGroup).datum();
      if (this.isFocused && !d3.select(barGroup).classed('bar-group--focused')) {
        return;
      }
      this.tooltip.transition().duration(200).style('opacity', 1);
      this.tooltip.html(parentDatum.key + ', ' + (d.data[parentDatum.key] * 100).toFixed(2) + '%').style('left', left + 'px').style('top', top + 'px');
      d3.select(el).classed('active', true);
    },
    hideTooltip: function hideTooltip(el, d) {
      this.tooltip.transition().duration(200).style('opacity', 0);
      d3.select(el).classed('active', false);
    },
    toggleFocus: function toggleFocus(el, d) {
      if (this.isFocused) {
        this.unfocusBar(el);
      } else {
        this.focusBar(el);
      }
    },
    drawBars: function drawBars() {
      var _this5 = this;

      var barGroups = this.g.selectAll('.bar-group').data(d3.stack().keys(this.stackKeys)(this.graphData));

      barGroups.exit().remove();

      barGroups = barGroups.enter().append('g').attr('fill', function (d) {
        return _this5.z(d.key);
      }).attr('class', 'bar-group');

      barGroups.selectAll('.bar').data(function (d) {
        return d;
      }).enter().append('rect').attr('class', 'bar').attr('x', function (d) {
        return _this5.x(d[0]);
      }).attr('y', function (d) {
        return _this5.y(d.data.district);
      }).attr('height', this.y.bandwidth()).attr('width', function (d) {
        return _this5.x(d[1]) - _this5.x(d[0]);
      }).on('mouseover', (0, _util.bindContext)(this, this.showTooltip)).on('mouseout', (0, _util.bindContext)(this, this.hideTooltip)).on('click', (0, _util.bindContext)(this, this.toggleFocus));
    },
    draw: function draw() {
      this.drawBars();
      this.drawAxes();
      this.drawLegend();
    }
  }
});
});

;require.register("data-getters.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCitizenshipData = getCitizenshipData;
exports.getCitizenshipKeys = getCitizenshipKeys;
exports.getReligionData = getReligionData;
exports.getReligionKeys = getReligionKeys;
exports.getReligionDefaultSort = getReligionDefaultSort;
exports.getAgeData = getAgeData;
exports.getAgeKeys = getAgeKeys;
exports.getAgeDefaultSort = getAgeDefaultSort;
exports.getForeignerData = getForeignerData;
exports.getWelfareData = getWelfareData;
exports.getMedianWealthData = getMedianWealthData;
exports.getAverageWealthData = getAverageWealthData;
exports.getMedianIncomeData = getMedianIncomeData;
exports.getAverageIncomeData = getAverageIncomeData;

var _common = require('./common');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getCitizenshipData(allData) {
  return function () {
    var year = '2016';
    var getKey = function getKey(item) {
      return _common.CITIZENSHIPS_PREFIX + item;
    };

    return _common.DISTRICTS.map(function (district) {
      var total = _common.CITIZENSHIPS.reduce(function (total, citizenship) {
        return total + allData[district][getKey(citizenship)][year];
      }, 0);

      var districtData = _common.CITIZENSHIPS.reduce(function (districtData, citizenship) {
        if (_common.CITIZENSHIPS_REDUCED.includes(citizenship)) {
          return districtData;
        }

        var rawDatum = allData[district][getKey(citizenship)][year];
        var proportionalDatum = rawDatum / total;
        districtData[citizenship] = proportionalDatum;

        if (citizenship == _common.CITIZENSHIPS_OTHERS) {
          districtData[citizenship] += _common.CITIZENSHIPS_REDUCED.reduce(function (sum, redCitizenship) {
            return sum + allData[district][getKey(redCitizenship)][year] / total;
          }, 0);
        }

        return districtData;
      }, {});

      districtData.total = total;
      districtData.district = _common.DISTRICT_NAMES[district];

      return districtData;
    });
  };
}

function getCitizenshipKeys() {
  return _common.CITIZENSHIPS_NONREDUCED;
}

function getReligionData(allData) {
  return function () {
    var year = '2013';
    var getKey = function getKey(item) {
      return _common.RELIGIONS_PREFIX + item;
    };

    return _common.DISTRICTS.map(function (district) {
      var total = _common.RELIGIONS.reduce(function (total, religion) {
        return total + allData[district][getKey(religion)][year];
      }, 0);

      var districtData = _common.RELIGIONS.reduce(function (districtData, religion) {
        var rawDatum = allData[district][getKey(religion)][year];
        var proportionalDatum = rawDatum / total;
        districtData[religion] = proportionalDatum;
        return districtData;
      }, {});

      districtData.total = total;
      districtData.district = _common.DISTRICT_NAMES[district];

      return districtData;
    });
  };
}

function getReligionKeys() {
  return _common.RELIGIONS;
}

function getReligionDefaultSort() {
  return _common.RELIGIONS_DEFAULT_SORT;
}

function getAgeData(allData) {
  return function () {
    var year = '2016';
    var getKey = function getKey(item) {
      return _common.AGE_GROUPS_PREFIX + item;
    };

    return _common.DISTRICTS.map(function (district) {
      var total = _common.AGE_GROUPS.reduce(function (total, ageGroup) {
        return total + allData[district][getKey(ageGroup)][year];
      }, 0);

      var districtData = _common.AGE_GROUPS.reduce(function (districtData, ageGroup) {
        var rawDatum = allData[district][getKey(ageGroup)][year];
        var proportionalDatum = rawDatum / total;
        var reducedKey = _common.AGE_GROUPS_REDUCTION[ageGroup];
        districtData[reducedKey] = districtData[reducedKey] || 0;
        districtData[reducedKey] += proportionalDatum;
        return districtData;
      }, {});

      districtData.total = total;
      districtData.district = _common.DISTRICT_NAMES[district];

      return districtData;
    });
  };
}

function getAgeKeys() {
  return _common.AGE_GROUPS_REDUCED;
}

function getAgeDefaultSort() {
  return _common.AGE_GROUPS_DEFAULT_SORT;
}

function getForeignerData(allData) {
  return function () {
    var _this = this;

    var year = '2016';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this.allData[district]['Bevölkerung: Ausländer'][year] / (_this.allData[district]['Bevölkerung: Ausländer'][year] + _this.allData[district]['Bevölkerung: Schweizer'][year])
      };
    });
    return graphData;
  };
}

function getWelfareData(allData) {
  return function () {
    var _this2 = this;

    var year = '2016';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this2.allData[district]['Sozialhilfequote'][year] / 100
      };
    });
    return graphData;
  };
}

function getMedianWealthData(allData) {
  return function () {
    var _this3 = this;

    var year = '2014';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this3.allData[district]['Geld: Reinvermögen Median'][year]
      };
    });
    return graphData;
  };
}

function getAverageWealthData(allData) {
  return function () {
    var _this4 = this;

    var year = '2014';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this4.allData[district]['Geld: Reinvermögen Mittelwert'][year]
      };
    });
    return graphData;
  };
}

function getMedianIncomeData(allData) {
  return function () {
    var _this5 = this;

    var year = '2014';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this5.allData[district]['Geld: Reineinkommen Median'][year]
      };
    });
    return graphData;
  };
}

function getAverageIncomeData(allData) {
  return function () {
    var _this6 = this;

    var year = '2014';
    var graphData = _common.DISTRICTS.map(function (district) {
      return {
        district: district,
        value: _this6.allData[district]['Geld: Reineinkommen Mittelwert'][year]
      };
    });
    return graphData;
  };
}
});

;require.register("data.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = getData;

var _common = require('./common');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformDistrictData(districtData) {
  return districtData.reduce(function (newData, datum) {
    newData[datum['Name']] = datum;
    return newData;
  }, {});
}

function transformRow(row) {
  var numberKeys = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
  numberKeys.forEach(function (key) {
    if (row[key].length == 0 || row[key] == '-') {
      row[key] = null;
    } else {
      row[key] = +row[key];
    }
  });
  return row;
}

function getDistrict(allData, district, done) {
  // TODO: Fix hack.
  d3.csv(_common.SETTINGS.csvPath + district + '.csv', transformRow, function (districtData) {
    allData[district] = transformDistrictData(districtData);
    done(null, allData);
  });
}

function getData(done) {
  _async2.default.reduce(_common.DISTRICTS, {}, getDistrict, done);
}
});

;require.register("hero-scene.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _util = require('./util');

var _colors = require('./colors');

var colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeroScene = function () {
  function HeroScene(_ref) {
    var _this = this;

    var selContainer = _ref.selContainer;

    _classCallCheck(this, HeroScene);

    this.elContainer = document.querySelector(selContainer);

    this.objectSize = 10;
    this.objectDepth = 200;
    this.objectDefaultZ = 0 - this.objectDepth / 2;
    this.objectCountX = 21;
    this.objectCountY = 20;
    this.objectSpeed = 0.03;
    this.objectDirectionChangeChance = 0;
    this.objectMinZ = this.objectDefaultZ;
    this.objectZDiff = 4;
    this.objectMaxZ = this.objectMinZ + this.objectZDiff;
    this.mouseRotationDampenX = 70000;
    this.mouseRotationDampenY = 20000;
    this.cameraRotXTarget = 0;
    this.cameraRotYTarget = 0;
    this.cameraRotXSpeed = 0.1;
    this.cameraRotYSpeed = 0.1;

    this.updateDimensions();

    this.scene = this.makeScene();
    this.camera = this.makeCamera();
    this.renderer = this.makeRenderer();
    this.makeObjects();
    this.lights = this.makeLights();

    Dom(window).bind('resize', function () {
      return _this.updateAndEnactDimensions();
    });
    Dom(this.elContainer).bind('mousemove', this.reactToMouse.bind(this));

    this.enactDimensions();
    this.render();
  }

  _createClass(HeroScene, [{
    key: 'reactToMouse',
    value: function reactToMouse(event) {
      var mouseXOnMove = event.clientX - this.width / 2;
      this.cameraRotYTarget = -mouseXOnMove / this.mouseRotationDampenX;

      var mouseYOnMove = event.clientY - this.height / 2;
      this.cameraRotXTarget = -mouseYOnMove / this.mouseRotationDampenY;
    }
  }, {
    key: 'updateCameraRotation',
    value: function updateCameraRotation() {
      this.camera.rotation.x += (this.cameraRotXTarget - this.camera.rotation.x) * this.cameraRotXSpeed;
      this.camera.rotation.y += (this.cameraRotYTarget - this.camera.rotation.y) * this.cameraRotYSpeed;
    }
  }, {
    key: 'randomizeObjectDirections',
    value: function randomizeObjectDirections() {
      var _this2 = this;

      this.objectDirections = this.objectDirections.map(function (direction, index) {
        var object = _this2.objects[index];
        var isObjectTooHigh = object.position.z > _this2.objectMaxZ;
        var isObjectTooLow = object.position.z < _this2.objectMinZ;
        var wasRollSuccessful = Math.random() < _this2.objectDirectionChangeChance;
        if (isObjectTooHigh || isObjectTooLow || wasRollSuccessful) {
          return direction * -1;
        } else {
          return direction;
        }
      });
    }
  }, {
    key: 'updateObjectPositions',
    value: function updateObjectPositions() {
      var _this3 = this;

      this.objects.forEach(function (object, index) {
        var change = _this3.objectSpeed * _this3.objectDirections[index];
        object.position.z += change;
      });
    }
  }, {
    key: 'animate',
    value: function animate() {
      this.randomizeObjectDirections();
      this.updateObjectPositions();
      this.updateCameraRotation();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      this.animate();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(function () {
        return _this4.render();
      });
    }
  }, {
    key: 'makeScene',
    value: function makeScene() {
      var scene = new THREE.Scene();
      return scene;
    }
  }, {
    key: 'makeCamera',
    value: function makeCamera() {
      // Depends on dimensions
      var camera = new THREE.PerspectiveCamera(this.cameraFov, this.aspectRatio, 0.1, 1000);
      camera.up = new THREE.Vector3(0, 1, 0);
      camera.rotation.x = this.cameraAngle;
      camera.position.x = -(this.objectSize / 2);
      camera.position.z = this.cameraZ;
      return camera;
    }
  }, {
    key: 'makeRenderer',
    value: function makeRenderer() {
      // Depends on dimensions
      var renderer = new THREE.WebGLRenderer({
        antialiasing: true,
        alpha: true
      });
      // renderer.shadowMap.enabled = true
      // renderer.shadowMap.soft = true
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.setSize(this.width, this.height);
      this.elContainer.appendChild(renderer.domElement);
      return renderer;
    }
  }, {
    key: 'makeObjectGeometry',
    value: function makeObjectGeometry(_ref2) {
      var width = _ref2.width,
          height = _ref2.height,
          depth = _ref2.depth;

      return new THREE.CubeGeometry(width, height, depth);
    }
  }, {
    key: 'makeObject',
    value: function makeObject(x, y) {
      var colorSet = colors.GRAPHIQ3_12_HIGHS;
      var colorIndex = 2;
      var colorCode = colorSet[colorIndex];
      var color = parseInt(colorCode.slice(1), 16);

      var material = new THREE.MeshLambertMaterial({ color: color });

      var geometry = this.makeObjectGeometry({
        width: this.objectSize,
        height: this.objectSize,
        depth: this.objectDepth
      });

      var mesh = new THREE.Mesh(geometry, material);
      // mesh.castShadow = true
      // mesh.receiveShadow = true

      var objectZ = this.objectDefaultZ + _.random(0, this.objectZDiff * 10) / 10;
      mesh.position.set(x, y, objectZ);

      this.scene.add(mesh);

      return mesh;
    }
  }, {
    key: 'makeObjects',
    value: function makeObjects() {
      var _this5 = this;

      var xRange = _.range(0 - this.objectCountX, this.objectCountX);
      var yRange = _.range(0 - this.objectCountY, this.objectCountY);
      var objects = xRange.reduce(function (xObjects, xIndex) {
        var yObjects = yRange.reduce(function (yObjects, yIndex) {
          var object = _this5.makeObject(_this5.objectSize * xIndex, _this5.objectSize * yIndex);
          return yObjects.concat([object]);
        }, []);
        return xObjects.concat(yObjects);
      }, []);

      this.objects = objects;
      this.objectDirections = this.objects.map(function () {
        return [-1, 1][_.random(0, 1)];
      });
    }
  }, {
    key: 'setLightShadow',
    value: function setLightShadow(light) {
      light.castShadow = true;
      light.shadow.mapSize.width = 8000;
      light.shadow.mapSize.height = 8000;
      light.shadow.camera.left = -200;
      light.shadow.camera.right = 200;
      light.shadow.camera.top = 200;
      light.shadow.camera.bottom = -200;
      light.shadow.camera.far = 2000;
    }
  }, {
    key: 'makeLights',
    value: function makeLights() {
      var ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      this.scene.add(ambientLight);

      var dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
      dirLight.position.set(200, 150, 80);
      // this.setLightShadow(dirLight)
      this.scene.add(dirLight);

      var spotLight = new THREE.SpotLight(0xffffff, 0.2);
      spotLight.position.set(100, 100, 150);
      this.scene.add(spotLight);
    }
  }, {
    key: 'updateDimensions',
    value: function updateDimensions() {
      this.width = this.elContainer.offsetWidth;
      this.height = this.elContainer.offsetHeight;
      this.aspectRatio = this.width / this.height;
      this.cameraFov = 80;
      this.cameraZ = 80;
      this.cameraAngle = 0 * Math.PI / 180;
    }
  }, {
    key: 'enactDimensions',
    value: function enactDimensions() {
      this.camera.aspect = this.aspectRatio;
      this.camera.fov = this.cameraFov;
      this.camera.rotation.x = this.cameraAngle;
      this.camera.position.z = this.cameraZ;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }
  }, {
    key: 'updateAndEnactDimensions',
    value: function updateAndEnactDimensions() {
      this.updateDimensions();
      this.enactDimensions();
    }
  }]);

  return HeroScene;
}();

exports.default = HeroScene;
});

;require.register("util.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindContext = bindContext;
exports.sampleEvenly = sampleEvenly;
function bindContext(ctx, fn) {
  /*
  For a context `ctx` and a function `fn`, returns a function `fn0`, that:
  - When called with [a, b, ...], will call `fn` with [this, a, b, ...]
  - Will have `ctx` as the context (`this`)
   Basically, you can do this:
   Dom(el).bind('click', bindContext(this, this.doSomething()))
   Which will call this.doSomething() with the proper context (`this`), while
  the context coming from the handler will be used as the first argument.
  This means that you can use `this` normally, while the stuff you need e.g.
  from the event handler will be passed as the first argument, with the rest
  of the arguments following.
  */
  return function () {
    fn.apply(ctx, [].concat([this]).concat([].slice.call(arguments)));
  };
}

function sampleEvenly(data, count) {
  /*
  From ICGenealogy:
  Evenly sample `count` elements from the `data`. The first element is chosen
  first, then the last element, then the middle portion is considered,
  splitting it recursively into half and choosing the middle element when
  the length is odd until the requested number of elements is chosen.
  */
  function sample(data, count) {
    /*
    Repeatedly split a list, choosing the middle element if the length is
    odd. Return the chosen element (if any), surrounded on the left and
    right by the elements chosen by the respective recursive calls. Return
    an empty list if there are no more elements to pick.
    */
    if (count <= 0) {
      return [];
    }
    var chosen = [];
    var rightHalfOffset = 0;

    // If the list's length is odd, choose the middle element before
    // splitting the list in two.
    var iMid = Math.floor(data.length / 2);
    if (data.length % 2 != 0) {
      rightHalfOffset = 1;
      chosen.push(data[iMid]);
      count--;
    }

    // Split the list into two parts, skipping the middle element if the
    // list's length is odd.
    var leftHalf = data.slice(0, iMid);
    var rightHalf = data.slice(iMid + rightHalfOffset, data.length);

    // Recursively sample these two parts, splitting the count into two.
    // If the count is not divisible by two, give the remainder to the
    // right half.
    var chosenLeft = sample(leftHalf, Math.floor(count / 2));
    var chosenRight = sample(rightHalf, Math.ceil(count / 2));

    return [].concat(chosenLeft, chosen, chosenRight);
  }

  if (count <= 0) {
    return [];
  }
  if (count == 1) {
    return data[0];
  }
  if (data.length <= count) {
    return data;
  }

  var firstElement = data[0];
  var lastElement = data[data.length - 1];
  var middlePortion = data.slice(1, data.length - 1);
  var middleElements = sample(middlePortion, count - 2);

  return [].concat([firstElement], middleElements, [lastElement]);
}
});

;require.alias("node-browser-modules/node_modules/buffer/index.js", "buffer");
require.alias("d3/build/d3.min.js", "d3");
require.alias("process/browser.js", "process");
require.alias("vue/dist/vue.js", "vue");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map