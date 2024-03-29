import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import * as util from '../util'
import {DISTRICT_NAMES} from '../common'


Vue.component('bar-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--bar-chart',
  props: [
    'allData', 'getGraphData', 'xLabel', 'yLabel', 'colors', 'xTickFormat', 'yTickFormat',
    'isTooltipDisabled',
  ],
  data: function() {
    return {
    }
  },

  mounted() {
    const elSvg = this.$el.querySelector('svg')
    const elSvgDims = elSvg.getBoundingClientRect()
    const svg = d3.select(elSvg)
    const margins = {
      top: 20,
      right: 55,
      bottom: 80,
      left: 70,
    }

    this.width = elSvgDims.width - margins.left - margins.right
    this.height = elSvgDims.height - margins.top - margins.bottom

    this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'))
    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    this.x = d3.scaleBand().rangeRound([0, this.width]).padding(0.1)
    this.y = d3.scaleLinear().rangeRound([this.height, 0])
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)

    this.graphData = []

    this.makeGraphData()
    this.draw()
  },

  methods: {
    makeGraphData() {
      // NOTE: It is very important that data is sorted, for colors to work.
      this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
      this.updateAxes()
    },

    updateAxes() {
      let graphDataValues = this.graphData.map((d) => d.value)
      this.x.domain(this.graphData.map((d) => d.district))
      this.y.domain([0, d3.max(graphDataValues)])
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length))
    },

    formatValue(val) {
      if (this.yTickFormat) {
        return this.yTickFormat(val)
      } else {
        return d3.format(',.2f')(val)
      }
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

    hideTooltip(el, d) {
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.select(el).classed('active', false)
    },

    draw() {
      let bottomAxis = d3.axisBottom(this.x)

      if (this.xTickFormat) {
        bottomAxis = bottomAxis.tickFormat(this.xTickFormat)
      }

      this.g.selectAll('.axis.axis--x').remove()
      let xAxis = this.g
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.height})`)
        .call(bottomAxis)
      xAxis
        .selectAll('text')
        .attr('transform', 'rotate(30)')
        .attr('text-anchor', 'start')
      xAxis
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${this.width}) rotate(90)`)
        .attr('dy', '-12px')
        .attr('text-anchor', 'end')
        .text(this.xLabel)

      let leftAxis = d3.axisLeft(this.y).ticks(6)
      if (this.yTickFormat) {
        leftAxis = leftAxis.tickFormat(this.yTickFormat)
      }

      this.g.selectAll('.axis.axis--y').remove()
      this.g
        .append('g')
        .attr('class', 'axis axis--y')
        .call(leftAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(90)')
        .attr('dx', '5px')
        .attr('dy', '-9px')
        .attr('text-anchor', 'end')
        .text(this.yLabel)

      let bars = this.g
        .selectAll('.bar')
        .data(this.graphData)

      bars.exit().remove()

      bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => this.x(d.district))
        .attr('y', (d) => this.y(d.value))
        .attr('width', this.x.bandwidth())
        .attr('height', (d) => this.height - this.y(d.value))
        .attr('fill', (d) => this.color(d.value))
        .on('mouseover', util.bindContext(this, this.showTooltip))
        .on('mouseout', util.bindContext(this, this.hideTooltip))
    },
  },
})
