var path = require('path')
var fs = require('fs')

var dbFile = path.resolve(__dirname, '../db.json')
var statsFile = path.resolve(__dirname, 'stats.html')

module.exports = {
  dbFile: dbFile,
  statsHtml: fs.readFileSync(statsFile).toString().trim(),
  port: 9118
}
