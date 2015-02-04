var express = require('express')
var path = require('path')
var app = module.exports = express()
app.enable('trust proxy')

app.use('/static', express.static(
  path.resolve(__dirname, '../../static'))
)

require('./api')(app)
require('./view')(app)
