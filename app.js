var http = require('http'),
    router = require('./router'),
    url = require('url')

var server = http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  var path = url.parse(req.url).pathname
  var currentRoute = router.match(path)
  currentRoute.fn(req, res, currentRoute)
})

server.listen(8008, function (err) {
  if (err) console.log('Doh', err)
  console.log('Yippee! A server is running on port 8008!')
})
