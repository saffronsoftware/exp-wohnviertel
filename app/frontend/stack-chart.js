import {
  DISTRICTS, DISTRICT_NAMES, CITIZENSHIPS, CITIZENSHIPS_PREFIX,
  CITIZENSHIPS_OTHERS, CITIZENSHIPS_REDUCED,
} from './common'
import {bindContext} from './util'
import * as colors from './colors'
import * as _ from 'lodash'
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
      bottom: 70,
      left: 100,
      legend: 200,
    }

    this.width = elSvgDims.width - margins.left - margins.right
    this.height = elSvgDims.height - margins.top - margins.bottom
    this.graphWidth = this.width - margins.legend

    this.g = svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.right})`)
    this.graphData = []

    this.x = d3.scaleLinear().rangeRound([0, this.graphWidth])
    this.y = d3.scaleBand().rangeRound([0, this.height]).padding(0.1)
    this.z = d3.scaleOrdinal().range(
      [].concat(colors.GRAPHIQ3_LOWER).concat(['#cccccc'])
    )

    this.isFocused = false
    this.sortingProperty = 'district'
    this.tooltipsEnabled = true

    this.makeGraphData()
    this.draw()
    this.drawTooltip()
  }

  makeGraphData() {
    let year = '2016'
    const getCitKey = (cit) => CITIZENSHIPS_PREFIX + cit

    this.graphData = DISTRICTS.map((district) => {
      let total = CITIZENSHIPS.reduce((total, citizenship) => {
        return total + this.allData[district][getCitKey(citizenship)][year]
      }, 0)

      let districtData = CITIZENSHIPS.reduce((districtData, citizenship) => {
        if (CITIZENSHIPS_REDUCED.includes(citizenship)) {
          return districtData
        }

        districtData[citizenship] = this.allData[district][getCitKey(citizenship)][year] / total

        if (citizenship == CITIZENSHIPS_OTHERS) {
          districtData[citizenship] += CITIZENSHIPS_REDUCED.reduce(
            (sum, redCitizenship) => {
              return sum + this.allData[district][getCitKey(redCitizenship)][year] / total
            }, 0
          )
        }

        return districtData
      }, {})

      districtData.total = total
      districtData.district = DISTRICT_NAMES[district]

      return districtData
    })

    this.stackKeys = _.difference(CITIZENSHIPS, CITIZENSHIPS_REDUCED)
    this.updateAxes()
  }

  updateAxes() {
    this.x.domain([0, 1])
    this.y.domain(
      _.sortBy(this.graphData, (d) => d[this.sortingProperty])
        .map((d) => d.district)
    )
    this.z.domain(this.stackKeys)
  }

  drawAxes() {
    this.g.selectAll('.axis.axis--x').remove()
    let xAxis = this.g
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
      .attr('transform', `translate(${this.graphWidth})`)
      .attr('dx', '0')
      .attr('dy', '2.2rem')
      .attr('text-anchor', 'end')
      .text('Teil')

    this.g.selectAll('.axis.axis--y').remove()
    this.g
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.y))
      .append('text')
      .attr('dx', '0rem')
      .attr('dy', '-0.8rem')
      .attr('text-anchor', 'end')
      .text('Wohnviertel')
  }

  drawLegend() {
    this.g.selectAll('.legend').remove()
    let legend = this.g
      .append('g')
      .attr('class', 'legend')
      .attr('text-anchor', 'end')
      .attr('y', 0)
      .selectAll('g')
      .data(this.stackKeys)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`)

    legend
      .append('rect')
      .attr('x', this.width - 20)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', this.z);

    legend
      .append('text')
      .attr('y', 10)
      .attr('dy', '0.35rem')
      .attr('transform', `translate(${this.width - 33}) rotate(-30)`)
      .attr('text-anchor', 'end')
      .text((d) => d)
  }

  getAllBars() {
    return this.g
      .selectAll('.bar-group')
      .data(d3.stack().keys(this.stackKeys)(this.graphData))
      .selectAll('.bar')
      .data((d) => d)
  }

  getFocusedBars() {
    return d3.selectAll('.bar-group.bar-group--focused .bar')
  }

  zeroBarX(bars) {
    return bars
      .transition()
      .duration(400)
      .attr('x', 0)
  }

  updateBarX(bars) {
    return bars
      .transition()
      .duration(400)
      .attr('x', (d) => this.x(d[0]))
  }

  updateBarY(bars) {
    return bars
      .transition()
      .duration(400)
      .attr('y', (d) => this.y(d.data.district))
  }

  hideUnfocusedBars() {
    d3.selectAll('.bar-group:not(.bar-group--focused)')
      .classed('bar-group--hidden', true)
      .transition()
      .duration(200)
      .style('opacity', 0)
  }

  showAllBars() {
    d3.selectAll('.bar-group')
      .classed('bar-group--hidden', false)
      .transition()
      .duration(400)
      .style('opacity', 1)
  }

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
  }

  unfocusBar() {
    this.isFocused = false
    this.tooltipsEnabled = false
    this.sortingProperty = 'district'

    d3.select('.bar-group--focused')
      .classed('bar-group--focused', false)

    this.updateAxes()
    this.drawAxes()
    this.updateBarX(this.updateBarY(this.getAllBars()))
    setTimeout(() => {
      this.tooltipsEnabled = true
      this.showAllBars()
    }, 800)
  }

  drawTooltip() {
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('opacity', 0)
  }

  showTooltip(el, d) {
    if (!this.tooltipsEnabled) {
      return
    }
    let rect = el.getBoundingClientRect()
    let barMid = (this.x(d[1]) - this.x(d[0])) / 2
    let left = rect.left + window.scrollX + barMid
    let top = rect.top + window.scrollY
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
      .html(parentDatum.key + ', ' + (d.data[parentDatum.key] * 100).toFixed(2) + '%')
      .style('left', left + 'px')
      .style('top', top + 'px')
    d3.select(el).classed('active', true)
  }

  hideTooltip(el, d) {
    this.tooltip
      .transition()
      .duration(200)
      .style('opacity', 0)
    d3.select(el).classed('active', false)
  }

  toggleFocus(el, d) {
    if (this.isFocused) {
      this.unfocusBar(el)
    } else {
      this.focusBar(el)
    }
  }

  drawBars() {
    let barGroups = this.g
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
  }

  draw() {
    this.drawAxes()
    this.drawBars()
    this.drawLegend()
  }
}
