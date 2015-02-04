var uuid = require('node-uuid').v4
var bodyParser = require('body-parser')
var db = require('./db')
var dbChannels = db.dbChannels
var dbComments = db.dbComments
var tss = require('./lib/tss')

module.exports = function (app) {

  app.use('/api', bodyParser.urlencoded({ extended: true }))

  app.post('/api/channels/:key/comments', function (req, res, next) {
    var channel = dbChannels.find({
      key: req.params.key
    })
    if (!channel || channel._del) {
      return res.status(404).send({
        error: 'channel not found with key: ' + req.params.key
      })
    }
    var text = req.body.text.slice(0, 2000)
    if (text.length < 1) {
      return res.status(400).send({
        error: 'empty comment text'
      })
    }
    var followed = dbComments.chain().filter({
      channel_id: channel.id
    }).last().value()
    var nextFloor = followed ? followed.floor + 1 : 1
    var comment = {
      id: getNextId(dbComments),
      floor: nextFloor,
      channel_id: channel.id,
      text: text,
      ip: req.ip,
      timestamp: tss()
    }
    dbComments.push(comment)
    db.save()
    res.send({ floor: comment.floor })
  })

  app.post('/api/channels', function (req, res) {
    var title = req.body.title.slice(0, 100)
    if (title.length < 1) {
      return res.status(400).send({
        error: 'empty channel title'
      })
    }
    var channel = dbChannels.find({ title: title })
    if (!channel) {
      channel = {
        id: getNextId(dbChannels),
        key: uuid(),
        title: title,
        ip: req.ip,
        timestamp: tss()
      }
      dbChannels.push(channel)
      db.save()
    }
    res.send({ key: channel.key })
  })

}


function getNextId(list) {
  var last = list.last()
  return last ? last.id + 1 : 1
}
