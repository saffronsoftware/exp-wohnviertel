import {DISTRICTS, DISTRICT_NAMES} from './common'
import * as d3 from 'd3'
import * as _ from 'lodash'

export default class TestGraph {
  constructor({allData, selSvg}) {
    this.allData = allData

    const elSvg = document.querySelector(selSvg)
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
    this.x = d3.scaleLinear().range([0, this.width])
    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.right})`)
    this.graphData = []

    this.setGraphData(this.makeGraphData())
    this.draw()
  }

  makeGraphData() {
    const year = '2016'
    let graphData = DISTRICTS.map((district) => ({
      district: district,
      // Ausländerteil
      value:
        this.allData[district]['Bevölkerung: Ausländer'][year] / (
          this.allData[district]['Bevölkerung: Ausländer'][year] +
          this.allData[district]['Bevölkerung: Schweizer'][year]
        ),
    }))
    // NOTE: It is very important that data is sorted, for `fixCollisions()`
    // to work.
    graphData = _.sortBy(graphData, (d) => d.value)
    return graphData
  }

  setGraphData(graphData) {
    this.graphData = graphData
    this.updateAxes()
  }

  updateAxes() {
    const min = d3.min(this.graphData.map((d) => d.value))
    const max = d3.max(this.graphData.map((d) => d.value))
    const padding = (max - min) / 15
    this.x.domain([min - padding, max + padding])
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
      .text('Ausländerteil')

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
