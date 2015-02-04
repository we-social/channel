var path = require('path')
//var jade = require('jade')
var exphbs = require('express-handlebars')
var _ = require('lodash')
var config = require('../../config')
var db = require('./db')
var dbChannels = db.dbChannels
var dbComments = db.dbComments

module.exports = function (app) {
  //app.engine('jade', jade.__express)
  app.engine('handlebars', exphbs())
  app.set('view engine', 'handlebars')
  app.set('views', path.resolve(__dirname, '../web'))

  app.get('/', addPathSlash, function (req, res) {
    //res.redirect(prefixUrl('/channels'))
    res.redirect('open')
  })
  //app.get('/channels', function (req, res) {
  //  res.send('Top Channels')
  //})

  app.get('/open', dropPathSlash, function (req, res) {
    res.render('channel-open.hbs')
  })

  app.get('/channels/:key', dropPathSlash, function (req, res, next) {
    var channel = dbChannels.find({
      key: req.params.key
    })
    if (!channel) {
      return res.redirect('../open')
    }
    var comments = dbComments.filter({
      channel_id: channel.id
    }).reverse()
    res.render('channel-view.hbs', {
      comments: comments,
      channel: channel,
      channel_json: JSON.stringify(
        _.pick(channel, ['key', 'title'])
      )
    })
  })
}


function addPathSlash(req, res, next) {
  var pathname = req._parsedUrl.pathname
  var search = req._parsedUrl.search || ''
  if (pathname === '/') return next()
  if (pathname.slice(-1) === '/') return next()
  var last = pathname.split('/').slice(-1)[0]
  var relative = last + '/' + search
  res.redirect(relative)
}
function dropPathSlash(req, res, next) {
  var pathname = req._parsedUrl.pathname
  var search = req._parsedUrl.search || ''
  if (pathname === '/') return next()
  if (pathname.slice(-1) !== '/') return next()
  var last = pathname.split('/').slice(-2)[0]
  var relative = '../' + last + search
  res.redirect(relative)
}
