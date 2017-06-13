import {AGE_GROUPS} from './common'
import * as d3 from 'd3'

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
    this.x = d3.scaleBand().rangeRound([0, this.width]).padding(0.1)
    this.y = d3.scaleLinear().rangeRound([this.height, 0])
    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.right})`)
    this.graphData = []

    this.makeGraphData()
    this.draw()
  }

  makeGraphData() {
    let district = 'altstadt-grossbasel'
    let year = '2016'
    this.graphData = AGE_GROUPS.map((ageGroup) => ({
      ageGroup: ageGroup,
      value: this.allData[district]['Alter: ' + ageGroup][year],
    }))
    this.updateAxes()
  }

  updateAxes() {
    this.x.domain(this.graphData.map((d) => d.ageGroup))
    this.y.domain([0, d3.max(this.graphData.map((d) => d.value))])
  }

  draw() {
    this.g.selectAll('.axis.axis--x').remove()
    this.g
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x))
      .append('text')
      .attr('x', this.width)
      .attr('dy', '-0.6rem')
      .attr('text-anchor', 'end')
      .text('Age group')

    this.g.selectAll('.axis.axis--y').remove()
    this.g
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.y).ticks(10))
      .append('text')
      .attr('transform', 'rotate(90)')
      .attr('dx', '3rem')
      .attr('dy', '-0.6rem')
      .attr('text-anchor', 'end')
      .text('Population')

    let bars = this.g
      .selectAll('.bar')
      .data(this.graphData)

    bars.exit().remove()

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.x(d.ageGroup))
      .attr('y', (d) => this.y(d.value))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.value))
  }
}
