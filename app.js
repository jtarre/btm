import express from 'express'
import bodyParser from 'body-parser'
import noodle from 'noodlejs'

const app = express()

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/article-sections', (req, res) => {
  const articles = req.body.articles
  const promises = articles.map((article) => {
    return noodle.query({
      url: article.url,
      selector: article.selector,
      extract: article.attribute
    })
  })
  Promise.all(promises).then(results => {
    const newsSections = results.map((result) => {
      return result.results[0].results[0]
    })
    const content = articles.map((article, index) => {
      const section = newsSections[index] !== undefined ? newsSections[index] : ""
      return {"url": article.url, "section": section}
    })
    res.json({"article_sections": content})
  })
})

app.listen(app.get('port'), () => {
  console.log('Bridge The Media is running on port', app.get('port'))
})
