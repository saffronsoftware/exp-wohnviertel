const errorHandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const _ = require('lodash')

const defaultEnvironment = 'development'
const environment = process.env.NODE_ENV || defaultEnvironment
process.env.NODE_ENV = environment

console.log('environment: ' + environment)

/*
Creates express app.
@return app {Object}
*/
function makeApp() {
  app = express()
  return app
}

/*
Sets the view render engine and file path for pug files.
@param app {Object}
*/
function addViews(app) {
  app.set('views', path.join(__dirname, 'app/views'))
  app.locals.basedir = app.get('views')
  app.set('view engine', 'pug')
}

/*
Sets the middleware parsers.
@param app {Object}
*/
function addParsers(app) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(cookieParser())
}

/*
Registers the environment for global use.
@param app {Object}
*/
function addEnvironments(app) {
  app.set('env', environment)
}

function addMisc(app) {
  app.use(logger('dev'))
  if (environment == 'development') { app.use(errorHandler()) }
  app.use(compression({
    threshold: 0,
    filter: (req, res) => { return true },
  }))
  app.use(express.static(path.join(__dirname, 'public')))
}

/*
Loads all routes defined in controllers.
@param app {Object}
*/
function addControllers(app) {
  require('./app/controllers')({app})
}

module.exports = ({environment, done}) => {
  app = makeApp()
  addViews(app)
  addParsers(app)
  addEnvironments(app)
  addMisc(app)
  addControllers(app)
  return app
}
