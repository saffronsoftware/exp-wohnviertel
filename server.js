const path = require('path')

const app = require('./app')({})
const environment = app.get('env')
const config = require('./config')

function makeServer(port) {
  const server = require('http').createServer(app)

  server
    .listen(port)
    .on('error', (error) => {
      if (error.syscall != 'listen') { throw error }
      if (error.code == 'EACCES') {
        console.error('Port ' + port + ' requires elevated privileges')
        process.exit(1)
      } else if (error.code == 'EADDRINUSE') {
        console.error('Port ' + port + ' is already in use')
        process.exit(1)
      } else {
        throw error
      }
    })
    .on('listening', () => {
      console.log('Listening on port ' + port)
    })
}

const port = +(process.env.PORT || config.port)
makeServer(port)
app.set('port', port)
