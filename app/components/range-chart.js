import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import {DISTRICTS, DISTRICT_NAMES} from '../common'
import * as util from '../util'
import * as colors from '../colors'


Vue.component('range-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--range-chart',
  props: [
    'allData', 'getGraphData', 'axisLabel', 'colors', 'isPercent', 'tickFormat',
    'isChf', 'radius', 'minDist', 'minPadding', 'isTooltipDisabled',
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
      top: 0,
      right: 5,
      bottom: 30,
      left: 5,
    }

    // Vue property shadowing, meeh.
    this.nodeRadius = this.radius || 8
    this.nodeMinDist = this.minDist || 21 // px

    this.width = elSvgDims.width - margins.left - margins.right
    this.height = elSvgDims.height - margins.top - margins.bottom

    this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'))
    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    this.x = d3.scaleLinear().range([0, this.width])
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)

    this.graphData = []

    this.makeGraphData()
    this.draw()
  },

  methods: {
    makeGraphData() {
      // NOTE: It is very important that data is sorted, for `fixCollisions()`
      // and colors to work.
      this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
      this.updateAxes()
    },

    updateAxes() {
      let graphDataValues = this.graphData.map((d) => d.value)
      const PADDING_FACTOR = 10
      const PADDING_MIN_FACTOR = this.minPadding || 0.5
      const PADDING_MAX_FACTOR = 1.5
      const min = d3.min(graphDataValues)
      const max = d3.max(graphDataValues)
      const padding = (max - min) / PADDING_FACTOR
      this.x.domain([
        min - (padding * PADDING_MIN_FACTOR),
        max + (padding * PADDING_MAX_FACTOR),
      ])
      this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length))
    },

    fixCollisions(nodes) {
      const MIN_DIST = this.nodeMinDist
      const NR_ITERATIONS = 150
      const FORCE_FACTOR = 10
      const FORCE = MIN_DIST / FORCE_FACTOR
      function doFixCollisions(d) {
        let curr = d3.select(this)
        let prev = d3.select(this.previousElementSibling)
        if (!prev.empty() && prev.classed('range-node')) {
          if (Math.abs(prev.attr('x') - curr.attr('x')) < MIN_DIST) {
            prev.attr('x', prev.attr('x') - FORCE)
          }
        }
      }
      _.times(NR_ITERATIONS, () => {
        nodes.each(doFixCollisions)
      })
    },

    getNodeMargin() {
      return Math.max(this.nodeRadius * 2, 15)
    },

    formatValue(val) {
      if (this.tickFormat) {
        return this.tickFormat(val)
      } else if (this.isPercent) {
        return d3.format(',.2%')(val)
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
      const TOP_MARGIN = 0 - 13 - this.nodeRadius // px
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 1)
      this.tooltip
        .html(DISTRICT_NAMES[d.district] + ' — ' + this.formatValue(d.value))
        .style('left', left + 'px')
        .style('top', top + TOP_MARGIN + 'px')
      d3.select(el).classed('active', true)
    },

    hideTooltip(el, d) {
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.select(el).classed('active', false)
    },

    draw() {
      this.g.selectAll('.axis.axis--x').remove()

      let bottomAxis = d3.axisBottom(this.x)
        .ticks(10, this.isPercent ? '%' : undefined)

      if (this.isChf) {
        bottomAxis = bottomAxis.tickFormat(util.formatChfShort)
      } else if (this.tickFormat) {
        bottomAxis = bottomAxis.tickFormat(this.tickFormat)
      }

      this.g
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.height})`)
        .call(bottomAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', this.width)
        .attr('dy', '-9px')
        .attr('text-anchor', 'end')
        .text(this.axisLabel)

      let nodes = this.g
        .selectAll('.range-node')
        .data(this.graphData)

      nodes.exit().remove()

      nodes = nodes
        .enter()
        .append('svg')
        .attr('class', 'range-node')
        .attr('x', (d) => this.x(d.value))
        .attr('y', this.height - this.getNodeMargin())
      nodes
        .append('circle')
        .attr('class', 'circle')
        .attr('r', this.nodeRadius)
        .attr('fill', (d) => d.isFake ? colors.INACTIVE : this.color(d.value))
        .on('mouseover', util.bindContext(this, this.showTooltip))
        .on('mouseout', util.bindContext(this, this.hideTooltip))
      nodes
        .append('text')
        .text((d) => d.isFake ? d.name : DISTRICT_NAMES[d.district])
        .attr('dx', '14px')
        .attr('dy', '1px')
        .attr('text-anchor', 'left')
        .attr('transform', 'rotate(-50)')

      this.fixCollisions(nodes)
    },
  },
})
