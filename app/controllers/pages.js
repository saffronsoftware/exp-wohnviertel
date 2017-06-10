const common = require('./common')

module.exports = ({app}) => {
  app.get('/', common.simpleView('pages/home'))
}
