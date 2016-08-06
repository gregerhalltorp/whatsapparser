const Parser = require('../../dist/').Parser;
const splitter = require('../../dist/').splitter;
const createReadStream = require('fs').createReadStream;
const es = require('event-stream');
const request = require('request');
const JSONStream = require('JSONStream');

const postOptions = {
  method: 'POST',
  url: 'http://127.0.0.1:5984/whatsapp/_bulk_docs',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const parser = new Parser();

createReadStream('../../test/test.txt', { flags: 'r' })
  .pipe(splitter)
  .pipe(parser)
  .pipe(JSONStream.stringify('{"docs":[', ',', ']}'))
  .pipe(process.stdout);
  // .pipe(request(postOptions, (err) => {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   return 0;
  // }));
