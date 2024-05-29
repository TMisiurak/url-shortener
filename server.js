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

mongoClient.connect();

app.get('/testUrl', (req, res) => {
  
});

app.get('/:shortUrl', (req, res) => {
  var shortUrl = req.params.shortUrl;

  // Verify if such URL has is present in the database
  mongoClient.db("urlShortner").collection("urls").findOne({'shortUrl': shortUrl}).then((rec) => {
    if (rec) {
      // Redirect to the target URL
      res.redirect(rec.longUrl);
    }
    else {
      // return that this URL has not been found
      res.end(`No records found for ${shortUrl}`);
    }
  });
});

app.get('/api/createShortUrl', (req, res) => {
  longUrl = req.query.url;

  // Verify that the record with such URL doesn't exist already
  mongoClient.db("urlShortner").collection("urls").findOne({'longUrl': longUrl}).then((rec) => {
    if (rec) {
      res.code = 400;
      res.end(`There is already a record for the ${longUrl} with a short URL of ${rec.shortUrl}`);
    }
    else {
      try {
        // Run the hash script
        runHashScript().then(scriptResult => {
          if (scriptResult) {
            urlObj = { shortUrl: scriptResult.trim(), longUrl: longUrl };
        
            // Save the record to the MongoDB database
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
});

function runHashScript() {
  // Create a Promise
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
    });
  });
}

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
