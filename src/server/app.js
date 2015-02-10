var express = require('express')
var path = require('path')
var app = module.exports = express()
app.enable('trust proxy')

app.use('/static', express.static(
  path.resolve(__dirname, '../../static'))
)
app.use('/media', express.static(
  path.resolve(__dirname, '../../media'))
)

require('./api')(app)
require('./view')(app)
