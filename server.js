const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const mongoUri = 'mongodb://127.0.0.1:27017/';

const mongoClient = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hostname = '127.0.0.1';
const port = 3000;

mongoClient.connect();

app.get('/:longUrl', (req, res) => {
  var longUrl = req.params.longUrl;
  var myobj = { shortUrl: "http://urlshort.com/short" , longUrl: "http://domain.com/longUrl" };

  var exists = mongoClient.db("urlShortner").collection("urls").findOne({'longUrl': longUrl}).then((rec) => {
    if (rec) {
      res.end(rec.shortUrl);
    }
    else {
      mongoClient.db("urlShortner").collection("urls").insertOne({ shortUrl: "test", })
    }
  })
  res.end(exists);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
