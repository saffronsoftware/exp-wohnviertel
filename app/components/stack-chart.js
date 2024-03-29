import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import * as d3 from 'd3'
import * as _ from 'lodash'
import {bindContext} from '../util'


Vue.component('stack-chart', {
  delimiters: ['${', '}'],
  template: '#component-template--stack-chart',
  props: [
    'allData', 'getGraphData', 'getKeys', 'xLabel', 'yLabel', 'colors', 'defaultSort',
    'legendColumnLength',
  ],
  data: function() {
    return {
      factoryDefaultSort: 'district',
      isFocused: false,
    }
  },

  mounted() {
    this.legendColumnWidth = 250
    this.legendColumnHeight = 25
    this.legendNrPerColumn = this.legendColumnLength || 5

    const elSvg = this.$el.querySelector('svg')
    const elSvgDims = elSvg.getBoundingClientRect()
    const svg = d3.select(elSvg)
    const margins = {
      top: 50 + (this.legendNrPerColumn * this.legendColumnHeight),
      right: 20,
      bottom: 40,
      left: 130,
    }

    this.tooltip = d3.select(this.$el.querySelector('.graph-tooltip'))

    this.width = elSvgDims.width - margins.left - margins.right
    this.height = elSvgDims.height - margins.top - margins.bottom
    this.graphWidth = this.width

    this.g = svg
      .append('g')
    this.graphContainer = this.g
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
    this.graphData = []

    this.x = d3.scaleLinear().rangeRound([0, this.graphWidth])
    this.y = d3.scaleBand().rangeRound([0, this.height]).padding(0.1)
    this.z = d3.scaleOrdinal().range(this.colors)

    this.sortingProperty = this.defaultSort || this.factoryDefaultSort
    this.tooltipsEnabled = true

    this.makeGraphData()
    this.draw()
  },

  methods: {
    makeGraphData() {
      this.graphData = this.getGraphData()
      this.stackKeys = this.getKeys()
      this.updateAxes()
    },

    updateAxes() {
      this.x.domain([0, 1])
      this.y.domain(
        _.sortBy(this.graphData, (d) => d[this.sortingProperty])
          .map((d) => d.district)
      )
      this.z.domain(this.stackKeys)
    },

    drawAxes() {
      this.graphContainer.selectAll('.axis.axis--x').remove()
      let xAxis = this.graphContainer
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.height})`)
        .call(d3.axisBottom(this.x).ticks(10, '%'))
      xAxis
        .selectAll('text')
        .attr('transform', 'rotate(30)')
        .attr('text-anchor', 'start')
      xAxis
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${this.graphWidth})`)
        .attr('dx', '0')
        .attr('dy', '33px')
        .attr('text-anchor', 'end')
        .text(this.xLabel)

      this.graphContainer.selectAll('.axis.axis--y').remove()
      this.graphContainer
        .append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(this.y))
        .append('text')
        .attr('class', 'axis-label')
        .attr('dx', '-9px')
        .attr('dy', '-2px')
        .attr('text-anchor', 'end')
        .text(this.yLabel)
    },

    drawLegend() {
      const makeTranslateForLegendItem = (d, i) => {
        const x = Math.floor(i / this.legendNrPerColumn) * this.legendColumnWidth
        const y = (i % this.legendNrPerColumn) * this.legendColumnHeight
        return `translate(${x}, ${y})`
      }
      this.g.selectAll('.legend').remove()
      let legend = this.g
        .append('g')
        .attr('class', 'legend')
        .selectAll('g')
        .data(this.stackKeys)
        .enter()
        .append('g')
        .attr('transform', makeTranslateForLegendItem)

      legend
        .append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', this.z)

      legend
        .append('text')
        .attr('dx', '30px')
        .attr('dy', '15px')
        .text((d) => d)
    },

    getAllBars() {
      return this.graphContainer
        .selectAll('.bar-group')
        .data(d3.stack().keys(this.stackKeys)(this.graphData))
        .selectAll('.bar')
        .data((d) => d)
    },

    getFocusedBars() {
      return d3.selectAll('.bar-group.bar-group--focused .bar')
    },

    zeroBarX(bars) {
      return bars
        .transition()
        .duration(400)
        .attr('x', 0)
    },

    updateBarX(bars) {
      return bars
        .transition()
        .duration(400)
        .attr('x', (d) => this.x(d[0]))
    },

    updateBarY(bars) {
      return bars
        .transition()
        .duration(400)
        .attr('y', (d) => this.y(d.data.district))
    },

    hideUnfocusedBars() {
      d3.selectAll('.bar-group:not(.bar-group--focused)')
        .classed('bar-group--hidden', true)
        .transition()
        .duration(200)
        .style('opacity', 0)
    },

    showAllBars() {
      d3.selectAll('.bar-group')
        .classed('bar-group--hidden', false)
        .transition()
        .duration(400)
        .style('opacity', 1)
    },

    focusBar(el) {
      this.isFocused = true
      let barGroup = el.parentNode
      let parentDatum = d3.select(barGroup).datum()
      this.sortingProperty = parentDatum.key

      d3.select(barGroup)
        .classed('bar-group--focused', true)

      this.hideUnfocusedBars()
      this.updateAxes()
      this.drawAxes()
      this.updateBarY(this.zeroBarX(this.getFocusedBars()))
    },

    unfocusBar() {
      this.isFocused = false
      this.tooltipsEnabled = false
      this.sortingProperty = this.defaultSort || this.factoryDefaultSort

      d3.select('.bar-group--focused')
        .classed('bar-group--focused', false)

      this.updateAxes()
      this.drawAxes()
      this.updateBarX(this.updateBarY(this.getAllBars()))
      setTimeout(() => {
        this.tooltipsEnabled = true
        this.showAllBars()
      }, 800)
    },

    showTooltip(el, d) {
      if (!this.tooltipsEnabled) {
        return
      }
      let rect = el.getBoundingClientRect()
      let barMid = (this.x(d[1]) - this.x(d[0])) / 2
      let left = rect.left + window.scrollX + barMid
      let top = rect.top + window.scrollY - 20
      let barGroup = el.parentNode
      let parentDatum = d3.select(barGroup).datum()
      if (this.isFocused && !(d3.select(barGroup).classed('bar-group--focused'))) {
        return
      }
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 1)
      this.tooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
      this.tooltip
        .select('.content')
        .html(parentDatum.key + ', ' + (d.data[parentDatum.key] * 100).toFixed(2) + '%')
      d3.select(el).classed('active', true)
    },

    hideTooltip(el, d) {
      this.tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.select(el).classed('active', false)
    },

    toggleFocus(el, d) {
      if (this.isFocused) {
        this.unfocusBar(el)
      } else {
        this.focusBar(el)
      }
    },

    drawBars() {
      let barGroups = this.graphContainer
        .selectAll('.bar-group')
        .data(d3.stack().keys(this.stackKeys)(this.graphData))

      barGroups.exit().remove()

      barGroups = barGroups
        .enter()
        .append('g')
        .attr('fill', (d) => this.z(d.key))
        .attr('class', 'bar-group')

      barGroups
        .selectAll('.bar')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => this.x(d[0]))
        .attr('y', (d) => this.y(d.data.district))
        .attr('height', this.y.bandwidth())
        .attr('width', (d) => this.x(d[1]) - this.x(d[0]))
        .on('mouseover', bindContext(this, this.showTooltip))
        .on('mouseout', bindContext(this, this.hideTooltip))
        .on('click', bindContext(this, this.toggleFocus))
        .style('cursor', 'pointer')
    },

    draw() {
      this.drawBars()
      this.drawAxes()
      this.drawLegend()
    },
  },
})
