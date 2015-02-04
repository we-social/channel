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
    .findLast({ channel_key: channel.key }).value()
  if (myComment) {
    //document.title = '我参与了 ##' + channel.title + '##'
  }

  $form_comment.on('submit', function (e) {
    e.preventDefault()
    if (submitted) return alert('稍安勿躁')
    var form = $form_comment.serializeJSON()
    if (!form['text']) return
    var url = 'api/channels/' + channel.key + '/comments'
    $.post(url, form, function (d) {
      if (typeof d !== 'object' || !d.floor) {
        return alert('发送失败，为毛？')
      }
      dbMyComments.push({
        floor: d.floor,
        channel_key: channel.key
      }).save()
      submitted = true
      $form_comment[0].reset()
      //alert('发送成功，楼层：' + d.floor)
      location.reload()
    })
  })
  $form_comment.on('keydown', function(e) {
    if (e.keyCode === 13 && e.ctrlKey) $form_comment.submit()
  })
})
