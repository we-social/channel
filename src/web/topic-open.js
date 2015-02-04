$(function initPage() {
  var dbMyComments = db('my_comments[]')
  var $form_open = $('#form_open')
  var submitted = false

  $form_open.on('submit', function (e) {
    e.preventDefault()
    if (submitted) return alert('稍安勿躁')
    var form = $form_open.serializeJSON()
    if (!form['title']) return
    $.post('api/topics', form, function (d) {
      if (typeof d !== 'object' || !d.key) {
        return alert('创建失败，为毛？')
      }
      if (form['comment']) {
        dbMyComments.push({
          floor: 1,
          topic_key: d.key
        }).save()
      }
      submitted = true
      //alert('创建成功，key：' + d.key)
      location.href = 'topics/' + d.key
    })
  })
})
