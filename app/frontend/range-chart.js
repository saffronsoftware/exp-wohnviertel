import {DISTRICTS, DISTRICT_NAMES} from './common'
import * as util from './util'
import * as d3 from 'd3'
import * as _ from 'lodash'

export default class RangeChart {
  constructor({allData, selSvg, getGraphData, xLabel, colors}) {
    this.allData = allData
    this.getGraphData = getGraphData
    this.xLabel = xLabel
    this.colors = colors

    const elSvg = document.querySelector(selSvg)
    elSvg.classList.add('chart', 'range-chart')
    const elSvgDims = elSvg.getBoundingClientRect()
    const svg = d3.select(selSvg)
    const margins = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    }

    this.width = elSvgDims.width - margins.left - margins.right
    this.height = elSvgDims.height - margins.top - margins.bottom

    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.right})`)

    this.x = d3.scaleLinear().range([0, this.width])
    this.color = d3.scaleLinear().range(this.colors).interpolate(d3.interpolateHsl)

    this.graphData = []

    this.makeGraphData()
    this.draw()
  }

  makeGraphData() {
    // NOTE: It is very important that data is sorted, for `fixCollisions()`
    // to work.
    this.graphData = _.sortBy(this.getGraphData(), (d) => d.value)
    this.updateAxes()
  }

  updateAxes() {
    let graphDataValues = this.graphData.map((d) => d.value)
    const min = d3.min(graphDataValues)
    const max = d3.max(graphDataValues)
    const padding = (max - min) / 12
    this.x.domain([min - padding, max + padding])
    this.color.domain(util.sampleEvenly(graphDataValues, this.colors.length))
  }

  fixCollisions(nodes) {
    const nrIterations = 20
    const minDist = 22 // px
    const forceFactor = 10
    const force = minDist / forceFactor
    function doFixCollisions(d) {
      let curr = d3.select(this)
      let prev = d3.select(this.previousElementSibling)
      if (!prev.empty() && prev.classed('range-node')) {
        if (Math.abs(prev.attr('x') - curr.attr('x')) < minDist) {
          prev.attr('x', prev.attr('x') - force)
        }
      }
    }
    _.times(nrIterations, () => {
      nodes.each(doFixCollisions)
    })
  }

  draw() {
    this.g.selectAll('.axis.axis--x').remove()
    this.g
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x).ticks(10, '%'))
      .append('text')
      .attr('x', this.width)
      .attr('dy', '-0.6rem')
      .attr('text-anchor', 'end')
      .text(this.xLabel)

    let nodes = this.g
      .selectAll('.range-node')
      .data(this.graphData)

    nodes.exit().remove()

    nodes = nodes
      .enter()
      .append('svg')
      .attr('class', 'range-node')
      .attr('x', (d) => this.x(d.value))
      .attr('y', this.height - 20)
    nodes
      .append('circle')
      .attr('class', 'circle')
      .attr('r', 10)
      .attr('fill', (d) => this.color(d.value))
    nodes
      .append('text')
      .text((d) => DISTRICT_NAMES[d.district])
      .attr('dx', '1.0rem')
      .attr('dy', '0.2rem')
      .attr('text-anchor', 'left')
      .attr('transform', 'rotate(-60)')

    this.fixCollisions(nodes)
  }
}
