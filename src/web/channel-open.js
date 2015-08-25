$(function initPage() {
  var dbMyChannels = db('my_channels[]')
  var $form_open = $('#form_open')
  var submitted = false

  $form_open.on('submit', function (e) {
    e.preventDefault()
    if (submitted) return alert('稍安勿躁')
    var form = $form_open.serializeJSON()
    if (!form['title']) return
    submitted = true
    $.post('api/channels', form, function (d) {
      if (typeof d !== 'object' || !d.key) {
        submitted = false
        return alert('进入失败，为毛？')
      }
      dbMyChannels.push({
        title: form['title'],
        key: d.key
      })
      dbMyChannels.save()
      $form_open[0].reset()
      //alert('进入成功，key：' + d.key)
      location.href = 'channels/' + d.key
    })
  })
  $form_open.on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      $form_open.submit()
    }
  })
})
