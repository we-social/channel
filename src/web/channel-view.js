$(function initPage() {
  var dbMyComments = db('my_comments[]')
  var $form_comment = $('#form_comment')
  var $input_media = $('[name="media"]')
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
    if (!form['text'] && !$input_media.val()) return
    var url = 'api/channels/' + channel.key + '/comments'
    submitted = true
    if ($input_media.val()) {
      $input_media.ajaxfileupload({
        auto_submit: true,
        validate_extensions: false,
        action: url,
        params: form,
        onComplete: onRespond
      })
    } else {
      $.post(url, form, onRespond)
    }
  })
  $form_comment.on('keydown', function(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      e.preventDefault()
      $form_comment.submit()
    }
  })

  function onRespond(d) {
    if (typeof d !== 'object' || !d.floor) {
      submitted = false
      return alert('发送失败，为毛？')
    }
    dbMyComments.push({
      floor: d.floor,
      channel_key: channel.key
    }).save()
    $form_comment[0].reset()
    //alert('发送成功，楼层：' + d.floor)
    location.reload()
  }
})
