import Vue from '../vue'
import * as d3 from 'd3'
import * as _ from 'lodash'
import {DISTRICTS, DISTRICT_NAMES} from '../common'
import * as util from '../util'


Vue.component('map-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--map-chart',
  props: [
    'allData', 'getGraphData', 'colors',
  ],
  data: function() {
    return {
    }
  },

  mounted() {
    this.svg = d3.select(Dom(this.$el).find('svg').elem())
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)
    this.makeGraphData()
    this.draw()
  },

  methods: {
    makeGraphData() {
      this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
      this.updateAxes()
    },

    updateAxes() {
      let graphDataValues = this.graphData.map((d) => d.value)
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length))
    },

    draw() {
      let makeKey = function(d) {
        if (d) {
          return d.district
        } else {
          return this.getAttribute('data-name')
        }
      }
      this.svg
        .selectAll('[data-name="wohnviertel"] polygon')
        .data(this.graphData, makeKey)
        .attr('fill', (d) => this.color(d.value))
    }
  },
})
