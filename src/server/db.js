var low = require('lowdb')
var config = require('../../config')
var db = module.exports = low(config.dbFile, {
  autosave: false,
  async: false
})
