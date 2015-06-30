var routes = require('routes'),
    qs = require('qs')
    fs = require('fs')
    db = require('monk')('localhost/writing'),
    prompts = db.get('prompts')

routes.addRoute('/prompts', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    prompts.find({}, function(err, docs) {
      var template = '<h1>Prompts | <a href="/prompts/new">Add a Prompt</a></h1>'
      docs.forEach(function (prompt) {
        template += '<h2><a href="/prompts/' + prompt._id + '">'  + prompt.title + '</a></h2>'
      })
      res.end(template)
    })
  }
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function() {
      var prompt = qs.parse(data)
      prompt.insert(prompt, function (err, doc) {
        if (err) res.end('err')
        res.writeHead(302, {'Location': '/prompts'})
        res.end()
      })
    })
  }
})
routes.addRoute('/prompts/new', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    fs.readFile('/templates/prompts/new.html', function(err, docs) {
      if (err) return 'nah!'
      res.end(file.toString)
    })
  }
})



module.exports = routes
