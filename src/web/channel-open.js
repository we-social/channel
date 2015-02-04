$(function initPage() {
  var dbMyComments = db('my_comments[]')
  var $form_open = $('#form_open')
  var submitted = false

  $form_open.on('submit', function (e) {
    e.preventDefault()
    if (submitted) return alert('稍安勿躁')
    var form = $form_open.serializeJSON()
    if (!form['title']) return
    $.post('api/channels', form, function (d) {
      if (typeof d !== 'object' || !d.key) {
        return alert('进入失败，为毛？')
      }
      if (form['comment']) {
        dbMyComments.push({
          floor: 1,
          channel_key: d.key
        }).save()
      }
      submitted = true
      $form_open[0].reset()
      //alert('进入成功，key：' + d.key)
      location.href = 'channels/' + d.key
    })
  })
  $form_open.on('keydown', function(e) {
    if (e.keyCode === 13) $form_open.submit()
  })
})
