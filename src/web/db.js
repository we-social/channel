function store(key, val) {
  if (arguments.length === 1) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(val))
}

var _dbCache = {}
function db(key) {
  if (_dbCache[key]) return _dbCache[key]
  var val = store(key) || (
    /\[\]$/.test(key) ? [] : {}
  )
  var chain = _.chain(val)
  chain.save = function () {
    store(key, val)
  }
  return _dbCache[key] = chain
}
