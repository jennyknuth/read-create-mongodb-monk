var routes = require('routes')(),
    qs = require('qs'),
    fs = require('fs'),
    db = require('monk')('localhost/writing'),
    prompts = db.get('prompts')

routes.addRoute('/prompts', function (req, res, url) {
  console.log(req.method, req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    prompts.find({}, function (err, docs) {
      if (err) return 'not found'
      var template = '<h1>Prompts | <a href="/prompts/new">Add a Prompt</a></h1>'
      docs.forEach(function (prompt) {
        template += '<h2><a href="/prompts/' + prompt._id + '">' + prompt.title + '</a></h2>'
      })
      res.end(template + '<br>prompts from: <a href="http://awesomewritingprompts.tumblr.com/" target="_blank">http://awesomewritingprompts.tumblr.com/</a>')
    })
  }
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      var prompt = qs.parse(data)
      prompts.insert(prompt, function (err, doc) {
        if (err) res.end('err')
        res.writeHead(302, {'Location': '/prompts'})
        res.end()
      })
    })
  }
})
routes.addRoute('/prompts/new', function (req, res, url) {
  console.log(req.method, req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    fs.readFile('templates/prompts/new.html', function (err, file) {
      if (err) return 'nah!'
      res.end(file)
    })
  }
})
routes.addRoute('/prompts/:id', function (req, res, url) {
  console.log(req.method, req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    prompts.findOne({_id: url.params.id}, function (err, doc) {
      if (err) return 'it broke'
      res.end('<h3>' + doc.title + '</h3>' + doc.prompt)
    })
  }
})

module.exports = routes
