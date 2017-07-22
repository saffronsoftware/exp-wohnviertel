import Vue from '../vue'

Vue.component('page', {
  delimiters: ['${', '}'],
  template: '#component-template--page',
  data: function() {
    return {
      locale: 'de',
    }
  },

  mounted() {
  },

  methods: {
    setLocale(locale) {
      this.locale = locale
    },
  },
})
