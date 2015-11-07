var uuid = require('node-uuid').v4
var bodyParser = require('body-parser')
var multer = require('multer')
var db = require('./db')
var dbChannels = db.dbChannels
var dbComments = db.dbComments
var tss = require('./lib/tss')
var fs = require('fs-extra')
var path = require('path')
var bytes = require('bytes')
var mediaDir = path.resolve(__dirname, '../../media')

module.exports = function (app) {

  app.use('/api', bodyParser.urlencoded({ extended: false }))
  app.use('/api', multer({ limits: bytes('4mb') }))

  app.post('/api/channels/:key/comments', function (req, res, next) {
    var channel = dbChannels.find({
      key: req.params.key
    })
    if (!channel || channel._del) {
      return res.status(404).send({
        error: 'channel not found with key: ' + req.params.key
      })
    }
    var text = req.body['text'] || ''
    text = text.trim().slice(0, 2000)
    var media = req.files['media']
    if (text.length < 1 && !media) {
      return res.status(400).send({
        error: 'empty comment input'
      })
    }
    if (media) {
      var mediaType
      if (/^image\//i.test(media.mimetype) &&
        /\.?(png|jpe?g|gif)$/i.test(media.extension)) {
        mediaType = 'image'
      } else if (/^audio\//i.test(media.mimetype) &&
        /\.?mp3$/i.test(media.extension)) {
        mediaType = 'audio'
      } else {
        return res.status(400).send({
          error: 'invalid media type'
        })
      }
      if (media.truncated ||
        mediaType === 'image' && media.size > bytes('200kb') ||
        mediaType === 'audio' && media.size > bytes('4mb')
      ) {
        return res.status(400).send({
          error: 'media size too large'
        })
      }
    }
    var followed = dbComments.chain().filter({
      channel_id: channel.id
    }).last().value()
    var nextFloor = followed ? followed.floor + 1 : 1
    var comment = {
      id: getNextId(dbComments),
      floor: nextFloor,
      channel_id: channel.id,
      ip: req.ip,
      timestamp: tss()
    }
    if (text) comment.text = text
    if (media) {
      fs.copySync(media.path, path.resolve(mediaDir, media.name))
      comment[mediaType + '_name'] = media.originalname
      comment[mediaType + '_mime'] = media.mimetype
      comment[mediaType + '_src'] = 'media/' + media.name
    }
    dbComments.push(comment)
    db.save()
    res.send({ floor: comment.floor })
  })

  app.post('/api/channels', function (req, res) {
    var title = req.body['title'] || ''
    title = title.trim().slice(0, 100)
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
  var last = list.get('length') ?
    list.last() : null
  return last ? last.id + 1 : 1
}
