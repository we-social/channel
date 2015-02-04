var low = require('lowdb')
var config = require('../../config')
var db = module.exports = low(config.dbFile, {
  autosave: false,
  async: false
})

db.dbComments = db('comments')
db.dbTopics = db('topics')
db.dbJsApiTicket = db('jsapi_ticket')
db.dbAccessToken = db('access_token')
