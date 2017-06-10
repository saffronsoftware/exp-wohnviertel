/*
Render a view, with some default data.
@param req {Object}
@param req {Object}
@param path {String} The path to the view
@param data {Object} The data to send to the view
*/
function render(req, res, path, data) {
  data = data || {}
  const defaultData = {
    reqQuery: req.query,
    reqBody: req.body,
    reqUser: req.user,
    reqSession: req.session,
    reqFullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
    viewPath: path,
  }
  const fullData = Object.assign({}, defaultData, data)
  res.render(path, fullData)
}

/*
Generates middleware which just renders a view.
@param view {String} Path of view to render
@param data {Function=} (req, res) Returns data object to be passed to view
*/
function simpleView(view, data) {
  data = data || function() {}
  if (typeof data != 'function') {
    const origData = data
    data = () => origData
  }
  return (req, res) => render(req, res, view, data(req, res))
}

module.exports = {render, simpleView}
