import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import {DISTRICTS, DISTRICT_NAMES} from '../common'
import * as util from '../util'


Vue.component('map-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--map-chart',
  props: [
    'allData', 'getGraphData', 'colors', 'isPercent',
  ],
  data: function() {
    return {
    }
  },

  mounted() {
    this.chartId = util.makeChartId()
    this.initLegend()
    this.initMap()
    this.draw()
  },

  methods: {
    initMap() {
      this.mapSvg = d3.select(this.$el.querySelector('svg.map'))

      this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)

      this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'))

      this.makeGraphData()
    },

    initLegend() {
      const elLegendSvg = this.$el.querySelector('svg.legend')
      this.legendSvg = d3.select(elLegendSvg)
      const legendSvgDims = elLegendSvg.getBoundingClientRect()

      this.legendBarWidth = 30
      const legendMargins = {
        top: 0,
        right: 35,
        bottom: 1,
        left: 0,
      }
      this.legendWidth = legendSvgDims.width - legendMargins.left - legendMargins.right
      this.legendHeight = legendSvgDims.height - legendMargins.top - legendMargins.bottom

      this.legendG = this.legendSvg
        .append('g')
        .attr('transform', `translate(${legendMargins.left}, ${legendMargins.top})`)

      this.legendY = d3.scaleLinear().rangeRound([this.legendHeight, 0])
    },

    makeGraphData() {
      this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
      this.updateAxes()
    },

    formatValue(val) {
      if (this.isPercent) {
        return d3.format('.0%')(val)
      } else {
        return d3.format(',.0f')(val)
      }
    },

    showTooltip(el, d) {
      let rect = el.getBoundingClientRect()
      let left = rect.left + window.scrollX + ((rect.right - rect.left) / 2)
      let top = rect.top + window.scrollY + ((rect.bottom - rect.top) / 2)
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 1)
      this.tooltip
        .html(DISTRICT_NAMES[d.district] + ' — ' + this.formatValue(d.value))
        .style('left', left + 'px')
        .style('top', top + 'px')
      d3.select(el).classed('active', true)
    },

    hideTooltip(el, d) {
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.select(el).classed('active', false)
    },

    updateAxes() {
      const graphDataValues = this.graphData.map((d) => d.value)
      const domain = util.linspace(
        d3.min(graphDataValues),
        d3.max(graphDataValues),
        this.colors.length
      )
      this.color.domain(domain)
      this.legendY.domain([d3.min(graphDataValues), d3.max(graphDataValues)])
    },

    drawMap() {
      const makeKey = function(d) {
        if (d) {
          return d.district
        } else {
          return this.getAttribute('data-name')
        }
      }

      this.mapSvg
        .selectAll('[data-name="wohnviertel"] polygon')
        .data(this.graphData, makeKey)
        .attr('fill', (d) => this.color(d.value))
        .on('mouseover', util.bindContext(this, this.showTooltip))
        .on('mouseout', util.bindContext(this, this.hideTooltip))
    },

    drawLegend() {
      this.legendG.selectAll('.axis.axis--y').remove()
      this.legendYAxis = this.legendG
        .append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', `translate(${this.legendWidth + 2}, 0)`)
        .call(d3.axisRight(this.legendY).tickFormat(this.formatValue))

      this.legendG.selectAll('defs').remove()
      const gradient = this.legendG
        .append('defs')
        .append('linearGradient')
        .attr('id', this.chartId + '__map-legend-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad')

      const stopPoints = util.linspace(0, 100, this.color.domain().length)
        .map(d => d + '%')
      const stops = d3.zip(stopPoints, this.color.range())
      stops.forEach(([point, color]) => {
        gradient
          .append('stop')
          .attr('offset', point)
          .attr('stop-color', color)
          .attr('stop-opacity', 1)
      })

      this.legendG.selectAll('rect').remove()
      this.legendG
        .append('rect')
        .attr('x', this.legendWidth - this.legendBarWidth)
        .attr('y', 0)
        .attr('width', this.legendBarWidth)
        .attr('height', this.legendHeight)
        .style('fill', `url(#${this.chartId}__map-legend-gradient)`)
    },

    draw() {
      this.drawLegend()
      this.drawMap()
    }
  },
})
