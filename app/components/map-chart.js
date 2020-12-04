import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import {DISTRICTS, DISTRICT_NAMES} from '../common'
import * as util from '../util'
import * as colors from '../colors'
import device from 'current-device'


Vue.component('map-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--map-chart',
  props: [
    'allData', 'getGraphData', 'colors', 'valueFormat', 'isChf', 'axisLabel',
    'isLegendDisabled', 'isTooltipDisabled', 'highlightDistrict', 'onClick',
  ],
  data: () => {
    return {
      legendMargins: {
        top: 35,
        right: 75,
        bottom: 10,
        left: 30,
      }
    }
  },
  watch: {
    highlightDistrict: function() {
      this.drawMap()
    },
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
        .on('mouseover', util.bindContext(this, this.showTooltip))
        .on('mouseout', util.bindContext(this, this.hideTooltip))
        .on('click', util.bindContext(this, this.handleClick))
    },

    initLegend() {
      const elLegendSvg = this.$el.querySelector('svg.legend')
      this.legendSvg = d3.select(elLegendSvg)
      const legendSvgDims = elLegendSvg.getBoundingClientRect()

      this.legendBarWidth = (device.mobile()) ? 8 : 30
      this.legendBarMargin = (device.mobile()) ? 8 : 12

      this.legendWidth = legendSvgDims.width
      this.legendHeight = legendSvgDims.height - this.legendMargins.top - this.legendMargins.bottom

      this.legendG = this.legendSvg
        .append('g')

      this.legendY = d3.scaleLinear().rangeRound([this.legendHeight, 0])
    },

    makeGraphData() {
      if (this.getGraphData) {
        this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
        this.updateAxes()
      } else {
        this.graphData = DISTRICTS.map((d) => ({district: d}))
      }
    },

    formatValue(val) {
      if (this.isChf) {
        return util.formatChfShort(val)
      } else if (this.valueFormat) {
        return d3.format(this.valueFormat)(val)
      } else {
        return d3.format(',.2f')(val)
      }
    },

    handleClick(el, d) {
      this.onClick(d.district)
    },

    showTooltip(el, d) {
      if (this.isTooltipDisabled) {
        return
      }
      const rect = el.getBoundingClientRect()
      const left = rect.left + window.scrollX + ((rect.right - rect.left) / 2)
      const top = rect.top + window.scrollY + ((rect.bottom - rect.top) / 2)
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

    getColorForData(d) {
      if (this.highlightDistrict) {
        if (d.district == this.highlightDistrict) {
          return this.colors[this.colors.length - 1]
        } else {
          return colors.INACTIVE
        }
      } else {
        return this.color(d.value)
      }
    },

    drawMap() {
      this.mapSvg
        .selectAll('[data-name="wohnviertel"] polygon')
        .attr('fill', (d) => this.getColorForData(d))
    },

    drawLegend() {
      this.legendG.selectAll('.axis.axis--y').remove()
      this.legendYAxis = this.legendG
        .append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisRight(this.legendY).tickFormat(this.formatValue))

      this.legendYAxis
        .append('text')
        .attr('class', 'axis-label')
        .attr(
          'transform',
          `translate(${-this.legendBarWidth - this.legendBarMargin}, ${this.legendHeight}) rotate(-90)`
        )
        .attr('text-anchor', 'start')
        .text(this.axisLabel)

      this.legendG
        .attr('transform', (d) => {
          let legendLabelWidth = this.legendYAxis.selectAll('.axis-label').node().getBBox().height  // using height because the element is rotate(90)
          // 4px are subtracted due to the browsers not accounting the bounding box inside the text drawn element causing the positioning to be off by ~2px
          // depending on the browser 
          return `translate(${legendLabelWidth + this.legendBarWidth + this.legendBarMargin - 4}, ${this.legendMargins.top})`
        })

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
        .attr('x', -this.legendBarWidth - 2)  // 2px for small space between gradient and tick axis
        .attr('y', 0)
        .attr('width', this.legendBarWidth)
        .attr('height', this.legendHeight)
        .style('fill', `url(#${this.chartId}__map-legend-gradient)`)
    },

    draw() {
      if (!this.isLegendDisabled) {
        this.drawLegend()
      }
      this.drawMap()
    }
  },
})
