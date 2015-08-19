var path = require('path')
var fs = require('fs')

var dbFile = path.resolve(__dirname, '../db.json')
var statsFile = path.resolve(__dirname, 'stats.html')

module.exports = {
	//有通过微信认证的微信公众号 则填入
  //wxAppId: 'wxXXXXXXXXXXXXXXXX',
  //wxAppSecret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  urlPrefix: '',
  dbFile: dbFile,
  statsHtml: fs.readFileSync(statsFile).toString().trim(),
  port: 9118
}
