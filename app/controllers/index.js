const common = require('./common')

module.exports = ({app}) => {
  require('./pages.js')({app})

  function send404(req, res, next) {
    res.status(404).format({
      html: () => common.render(req, res, 'pages/error'),
      json: () => res.type('json').send({error: 'Not found.'}),
      text: () => res.type('txt').send('Not found.'),
    })
  }

  app.use(send404)
}
