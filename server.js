const express = require('express');
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');

const app = express();

const mongoUri = 'mongodb://127.0.0.1:27017/';

const mongoClient = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hostname = '127.0.0.1';
const port = 3000;

// const server = createServer((req, res) => {
  // mongoClient.connect(mongoUri, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("urlShortner");
  //   console.log("Database created!");
  //   dbo.createCollection("urls", function(err, res) {
  //     if (err) throw err;
  //     console.log("Urls collection created!");

  //     var myobj = { longUrl: "http://domain.com/longUrl", shortUrl: "http://urlshort.com/short" };
  //     dbo.collection("urls").insertOne(myobj, function(err, res) {
  //       if (err) throw err;
  //       console.log("1 document inserted");
  //       // db.close();
  //     });
  //     // db.close();
  //   });
  //   // db.close();
  // });

// res.statusCode = 200;
// res.setHeader('Content-Type', 'text/plain');
// res.end('Hello World');

mongoClient.connect();

app.get('/:shortUrl', (req, res) => {
  var shortUrl = req.params.shortUrl;
  var myobj = { shortUrl: "a12ds", longUrl: "http://domain.com/longUrl" };

  // mongoClient.db("urlShortner").collection("urls").insertOne(myobj, function(err, res) {
  //         if (err) throw err;
  //         console.log("1 document inserted");
  //       });

  mongoClient.db("urlShortner").collection("urls").findOne({'shortUrl': shortUrl}).then((rec) => {
    if (rec) {
      res.end(rec.longUrl);
    }
    else {
      // return that this URL has not been found
      res.end(`No records found for ${shortUrl}`);
      //mongoClient.db("urlShortner").collection("urls").insertOne({ shortUrl: "test", longUrl: })
    }
  });
  // res.end(exists);
});

app.get('/api/createShortUrl', (req, res) => {
  longUrl = req.query.url;

  mongoClient.db("urlShortner").collection("urls").findOne({'longUrl': longUrl}).then((rec) => {
    if (rec) {
      res.code = 400;
      res.end(`There is already a record for the ${longUrl} with a short URL of ${rec.shortUrl}`);
    }
    else {
      try {
        runHashScript().then(scriptResult => {
          if (scriptResult) {
            urlObj = { shortUrl: scriptResult.trim(), longUrl: longUrl };
        
            mongoClient.db("urlShortner").collection("urls").insertOne(urlObj, function(res, err) {
              if (res) console.log(`1 entry added to the database: ${myobj}`);
              if (err) throw err;
            });
            res.end(`Short URL for ${longUrl} is ${scriptResult}`);
          }
          else {
            res.code = 500;
            res.end("Something went wrong");
          }
        });
      }
      catch(err) {
        console.log(`An error has occured when calling the hash script`);
      }
    }
  });

  // res.end(`longUrl is ${longUrl}`);
});

function runHashScript() {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['encoder.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      if (data) {
        result = data.toString('utf-8');
        console.log(`Result from script: ${data.toString()}`);
        resolve(result);
      }
      else {
        reject('Script failed');
      }
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
    });
  });
}

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
