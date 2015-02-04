var uuid = require('node-uuid').v4
var bodyParser = require('body-parser')
var db = require('./db')
var dbTopics = db.dbTopics
var dbComments = db.dbComments
var tss = require('./lib/tss')

module.exports = function (app) {

  app.use('/api', bodyParser.urlencoded({
    extended: true
  }))

  app.post('/api/topics/:key/comments', verify, function (req, res, next) {
    var topic = dbTopics.find({
      key: req.params.key
    }).value()
    if (!topic || topic._del) {
      return next(new Error(
        'topic not found with key: ' + req.params.key
      ))
    }
    var followed = dbComments.filter({
      topic_id: topic.id
    }).last().value()
    var nextFloor = followed ? followed.floor + 1 : 1
    var comment = {
      id: getNextId(dbComments),
      floor: nextFloor,
      topic_id: topic.id,
      text: req.body.text,
      ip: req.ip,
      timestamp: tss()
    }
    dbComments.push(comment)
    db.save()
    res.send({ floor: comment.floor })
  })

  app.post('/api/topics', verify, function (req, res) {
    var topic = {
      id: getNextId(dbTopics),
      key: uuid(),
      title: req.body.title,
      ip: req.ip,
      timestamp: tss()
    }
    dbTopics.push(topic)
    var ret = { key: topic.key }
    
    if (req.body.comment) {
      var comment = {
        id: getNextId(dbComments),
        floor: 1,
        topic_id: topic.id,
        text: req.body.comment,
        ip: req.ip,
        timestamp: tss()
      }
      dbComments.push(comment)
      ret.comment_id = comment.id
    }
    db.save()
    res.send(ret)
  })

}


function verify(req, res, next) {
  next()
}
function getNextId(list) {
  var last = list.last().value()
  return last ? last.id + 1 : 1
}
