var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs')

var confPath = './json/config.json'

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.listen(80)

app.get('/initLabStatus', function (req, res) {
  var content = fs.readFileSync(confPath)
  res.send(content)
})

app.post('/updateLabStatus', function (req, res) {
  var content = fs.readFileSync(confPath)
  var json  = JSON.parse(content)

  console.log(req.body)

  json.forEach(function (item, index, array) {
    if (item['name'] == req.body['name']) {
      item['value'] = req.body['value']
    }
  })

  console.log(JSON.stringify(json))

  fs.writeFile(confPath, JSON.stringify(json), function () {
      res.sendStatus(200)
    })
})
