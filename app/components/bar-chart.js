import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import * as util from '../util'
import {DISTRICT_NAMES} from '../common'
import device from 'current-device'


Vue.component('bar-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--bar-chart',
  props: [
    'id', 'allData', 'getGraphData', 'xLabel', 'yLabel', 'colors',
    'xTickFormat', 'yTickFormat', 'yTickFormatMobile',
    'isTooltipDisabled',
  ],
  data: function() {
    return {
      graphData: [],
      width: Number,
      height: Number,
      svgEl: SVGElement,
      dragStartPosition: Number,
      graph: {
        w: Number,
        h: Number,
        inner: {
          w: Number,
          h: Number
        },
        el: {},
        position: 0,
        dm: 0
      },
      margins: {
        left: 70,
        top: 28,
        right: 55,
        bottom: 80,
      }
    }
  },

  mounted() {
    const elSvg = this.$el.querySelector('svg')
    const elSvgDims = elSvg.getBoundingClientRect()
    const svg = d3.select(elSvg)

    if (device.mobile() || device.tablet()) {
      this.margins.left = this.margins.right = 4
    }

    this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'))
    this.g = svg
      .append('g')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)

    this.graph.w = this.width = elSvgDims.width - this.margins.left - this.margins.right
    this.graph.h = this.height = elSvgDims.height - this.margins.top - this.margins.bottom

    this.graph.h = this.height = (device.mobile() || device.tablet()) ? window.innerHeight / 2 : this.graph.h

    if (device.mobile() || device.tablet()) {
      this.x = d3.scaleLinear().rangeRound([this.graph.w, 0])
      this.y = d3.scaleBand().rangeRound([this.graph.h, 0]).padding(0.1)
    }
    else {
      this.x = d3.scaleBand().rangeRound([0, this.graph.w]).padding(0.1)
      this.y = d3.scaleLinear().rangeRound([this.graph.h, 0])
    }
    
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)

    let greyscale = ['#000', '#333', '#eee', '#fff']

    this.makeGraphData()

    const draw = (device.mobile() || device.tablet()) ? this.verticalDraw : this.draw
    draw()

    let contain = this.g.node().getBBox()
    elSvg.setAttribute('height', contain.height + this.margins.top)
  },

  methods: {
    makeGraphData() {
      // NOTE: It is very important that data is sorted, for colors to work.
      this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)

      this.updateAxes()
    },

    updateAxes() {
      let graphDataValues = this.graphData.map((d) => d.value)
      let districtDomain = this.graphData.map((d) => d.district)
      let rangeDomain = [10, d3.max(graphDataValues)]

      this.x.domain((device.mobile() || device.tablet()) ? rangeDomain : districtDomain)
      this.y.domain((device.mobile() || device.tablet()) ? districtDomain : rangeDomain)

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

    colourLabel(d, i) { // is this how you spell marian??
      let colour

      switch (this.id) {
        case 'average-net-worth':
        case 'average-net-income':
        case 'average-net-income-extra':
          colour = (i >= 11) ? '#fff' : '#000'
          break
        case 'workers':
          colour = (i >= 14) ? '#fff' : '#000'
          break
        case 'average-net-worth-extra':
          colour = (i >= 14 && i != 18) ? '#fff' : '#000'
          break
        default:
          colour = '#000'
      }

      return colour
    },

    verticalDraw() {
      let topAxis = d3.axisTop(this.x).ticks(6)

      if (this.yTickFormatMobile && (device.mobile() || device.tablet()))
        topAxis = topAxis.tickFormat(this.yTickFormatMobile)
      else if (this.yTickFormat)
        topAxis = topAxis.tickFormat(this.yTickFormat)

      let rightAxis = d3.axisLeft(this.y)

      rightAxis = (this.xTickFormat) ? rightAxis.tickFormat(this.xTickFormat) : rightAxis

      let bars = this.g
        .append('g')
        .selectAll('.bar')
        .data(this.graphData)

      bars.exit().remove()

      bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('transform', `translate(2, ${this.margins.top})`)  // for padding to make the tick marks visible
        .attr('x', (d) => this.x(d.value))
        .attr('y', (d) => this.y(d.district))
        .attr('width', (d) => this.graph.w - this.x(d.value) - 8)  // moving for translate padding
        .attr('height', this.y.bandwidth())
        .attr('fill', (d) => this.color(d.value))
        .on('mouseover', util.bindContext(this, this.showTooltip))
        .on('mouseout', util.bindContext(this, this.hideTooltip))

      let yAxis = this.g
        .append('g')
        .attr('id', 'test-y-id')
        .attr('class', 'axis axis--y')
        .attr('transform', `translate(${this.graph.w}, ${this.margins.top})`)
        .call(rightAxis)

      yAxis.selectAll('text')
        .attr('fill', this.colourLabel)

      let xAxis = this.g
        .append('g')
        .attr('id', 'test-id')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.margins.top})`)
        .call(topAxis)

      xAxis
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${this.graph.w}, ${-this.margins.top})`)
        .attr('text-anchor', 'end')
        .text(this.xLabel)
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
