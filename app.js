import express from 'express'
const app = express()

app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.json({})
})

app.listen(app.get('port'), function () {
  console.log('Bridge The Media is running on port', app.get('port'))
})
