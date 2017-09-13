import express from 'express'
const app = express()

app.get('/', function (req, res) {
  res.json({})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
