import * as d3 from 'd3'
import Vue from '../vue'
import HeroScene from '../hero-scene'


Vue.component('hero', {
  delimiters: ['${', '}'],
  template: '#component-template--hero',
  props: ['locale'],
  data: function() {
    return {
    }
  },

  mounted() {
    let hero = new HeroScene({
      selContainer: '#hero-scene',
    })
  },

  methods: {
  },
})
