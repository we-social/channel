var crypto = require('crypto')
var request = require('request')
var config = require('../../config')
var db = require('./db')
var dbAccessToken = db.dbAccessToken
var dbJsApiTicket = db.dbJsApiTicket
var wxSign = require('./lib/wx-sign')
var tss = require('./lib/tss')
var wx = module.exports = {}


wx.getJsApiSign = function (req, cb) {
  wx.getJsApiTicket(function (e, d) {
    if (e) return cb(e)
    var sign = wxSign(d.jsapi_ticket, fullUrl(req))
    sign.appId = config.wxAppId
    cb(null, sign)
  })
}

wx.getJsApiTicket = function (cb) {
  var item = dbJsApiTicket.first().value()
  if (item && item.deadline - tss() > 60) {
    return cb(null, item)
  }
  reqJsApiTicket(function (e, d) {
    if (e) return cb(e)
    item = {
      jsapi_ticket: d.ticket,
      deadline: d.expires_in + tss()
    }
    dbJsApiTicket.remove()
    dbJsApiTicket.push(item)
    db.save()
    cb(null, item)
  })
}
wx.getAccessToken = function (cb) {
  var item = dbAccessToken.first().value()
  if (item && item.deadline - tss() > 60) {
    return cb(null, item)
  }
  reqAccessToken(function (e, d) {
    if (e) return cb(e)
    item = {
      access_token: d.access_token,
      deadline: d.expires_in + tss()
    }
    dbAccessToken.remove()
    dbAccessToken.push(item)
    db.save()
    cb(null, item)
  })
}

function reqJsApiTicket(cb) {
  wx.getAccessToken(function (e, d) {
    if (e) return cb(e)
    var reqJsApiTicket =
      'https://api.weixin.qq.com/cgi-bin/ticket' +
      '/getticket?access_token=' +
      d.access_token +
      '&type=jsapi'
    request({
      url: reqJsApiTicket,
      json: true
    }, function (e, r, d) {
      if (e) return cb(e)
      if (d.errcode) {
        return cb(new Error(
          d.errcode + ': ' + d.errmsg
        ))
      }
      cb(null, d)
    })
  })
}
function reqAccessToken(cb) {
  var reqAccessTokenUrl =
    'https://api.weixin.qq.com/cgi-bin/token' +
    '?grant_type=client_credential&appid=' +
    config.wxAppId +
    '&secret=' +
    config.wxAppSecret
  request({
    url: reqAccessTokenUrl,
    json: true
  }, function (e, r, d) {
    if (e) return cb(e)
    if (d.errcode) {
      return cb(new Error(
        d.errcode + ': ' + d.errmsg
      ))
    }
    cb(null, d)
  })
}


function fullUrl(req) {
  return req.protocol + '://' +
    req.get('host') +
    config.urlPrefix +
    req.originalUrl
}
