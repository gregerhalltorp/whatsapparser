import { Parser, splitter } from './../../dist'; // eslint-disable-line
import { createReadStream } from 'fs';
import { stringify } from 'JSONStream';
import request from 'request';
import minimist from 'minimist';

const postOptions = {
  method: 'POST',
  url: 'http://127.0.0.1:5984/whatsapp/_bulk_docs',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const parser = new Parser();
const inputArgs = minimist(process.argv.slice(2));

const outputStream =
  (inputArgs && inputArgs.o && inputArgs.o === 'db')
  ? request(postOptions, (err) => {
    if (err) {
      return console.error(err);
    }
    return 0;
  })
  : process.stdout;
createReadStream('../../test/test.txt', { flags: 'r' })
  .pipe(splitter)
  .pipe(parser)
  .pipe(stringify('{"docs":[', ',', ']}'))
  .pipe(outputStream);
