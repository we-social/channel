$(function initPage() {
  var dbMyComments = db('my_comments[]')
  var $form_comment = $('#form_comment')
  var submitted = false

  // hack
  $('span>button').each(function () {
    var $btn = $(this)
    //$btn.height($btn.parent().height())
    $btn.css({
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
      'height': $btn.parent().height()
    })
  })

  var myComment = dbMyComments
    .findLast({ topic_key: topic.key }).value()
  if (myComment) {
    //document.title = '我参与了 ##' + topic.title +
    //  '## ，' + myComment.floor + '楼是我'
  }

  $form_comment.on('submit', function (e) {
    e.preventDefault()
    if (submitted) return alert('稍安勿躁')
    var form = $form_comment.serializeJSON()
    if (!form['text']) return
    var url = 'api/topics/' + topic.key + '/comments'
    $.post(url, form, function (d) {
      if (typeof d !== 'object' || !d.floor) {
        return alert('评论失败，为毛？')
      }
      dbMyComments.push({
        floor: d.floor,
        topic_key: topic.key
      }).save()
      submitted = true
      //alert('评论成功，楼层：' + d.floor)
      location.reload()
    })
  })
})
