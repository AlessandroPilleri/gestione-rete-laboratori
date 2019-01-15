var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs')

var confJSON = './conf/config.json'
var confProxy = './conf/proxy_access.txt'

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.listen(80)

app.get('/initLabStatus', function (req, res) {
  var content = fs.readFileSync(confJSON)
  res.send(content)
})

app.post('/updateLabStatus', function (req, res) {
  var content = fs.readFileSync(confJSON)
  var json  = JSON.parse(content)

  console.log(req.body)

  var proxy = fs.readFileSync(confProxy)

  json.forEach(function (item, index, array) {
    if (item['name'] == req.body['name']) {
      item['value'] = req.body['value']
      if (proxy.indexOf(item['proxy']) >= 0) {
        proxy = proxy.split('\n').slice(proxy.indexOf(item['proxy'])).join('\n');
      }
      else {
        proxy.join(item['proxy'])
      }
    }
  })

  console.log(JSON.stringify(json))

  fs.writeFile(confJSON, JSON.stringify(json), function () {
      res.sendStatus(200)
    })
})

app.post('/newLab', function (req, res) {
  var content = fs.readFileSync(confJSON)
  var json = JSON.parse(content)

  console.log(req.body)
  req.body['proxy'] = req.body['firstip'] + '-' + req.body['lastip'] + '/255.255.255.255'

  json.push(req.body)
  console.log(JSON.stringify(json))

  fs.writeFile(confJSON, JSON.stringify(json), function () {
    res.sendStatus(200)
  })
})
