var path = require('path')
var fs = require('fs')
//var jade = require('jade')
var exphbs = require('express-handlebars')
var _ = require('lodash')
var config = require('../../config')
var wx = require('./wx')
var db = require('./db')
var dbChannels = db.dbChannels
var dbComments = db.dbComments
var hbs = exphbs.create()
var Handlebars = hbs.handlebars

module.exports = function (app) {
  //app.engine('jade', jade.__express)
  app.engine('hbs', hbs.engine)
  app.set('view engine', 'hbs')
  app.set('views', path.resolve(__dirname, '../web'))

  app.get('/', addPathSlash, function (req, res) {
    //res.redirect(prefixUrl('/channels'))
    res.redirect('open')
  })
  //app.get('/channels', function (req, res) {
  //  res.send('Top Channels')
  //})

  app.get('/wxtest', dropPathSlash, function (req, res, next) {
    res.__tmpl = 'wxtest.hbs'
    next()
  })

  app.get('/open', dropPathSlash, function (req, res, next) {
    res.__tmpl = 'channel-open'
    next()
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
    res.__tmpl = 'channel-view'
    res.__data = {
      comments: comments,
      channel: channel,
      channel_json: JSON.stringify(
        _.pick(channel, ['key', 'title'])
      ),
      helpers: {
        format: function (text) {
          var html = Handlebars.Utils.escapeExpression(text)
          html = html.replace(/[\r\n]+/g, '<br>')
          html = html.replace(/(https?:\/\/[^\s]+)/ig, '<a href="$1">$1</a>')
          return new Handlebars.SafeString(html)
        }
      }
    }
    next()
  })

  app.get('*', function(req, res, next) {
    if (!res.__tmpl) return next()
    wx.getJsApiSign(req, function (e, d) {
      if (e) return next(e)
      var data = _.extend({
        wxSign: d,
        url_prefix: config.urlPrefix,
        stats_html: config.statsHtml
      }, res.__data)
      res.render(res.__tmpl, data)
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
