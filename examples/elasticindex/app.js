import { Parser, splitter } from './../../dist'; // eslint-disable-line
import { createReadStream } from 'fs';
import { stringify } from 'JSONStream';
import request from 'request';
import minimist from 'minimist';

const postOptions = {
  method: 'POST',
  url: 'http://elasticsearch:9200/whatsapp/message/_bulk',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const parser = new Parser();
const inputArgs = minimist(process.argv.slice(2));

const fileName =
  (inputArgs && inputArgs.f) ? inputArgs.f : './../../test/test.txt';

const outputStream =
  (inputArgs && inputArgs.o && inputArgs.o === 'db')
  ? request(postOptions, (err) => {
    if (err) {
      return console.error(err);
    }
    return 0;
  })
  : process.stdout;
createReadStream(fileName, { flags: 'r' })
  .pipe(splitter)
  .pipe(parser)
  .pipe(stringify('{"index": {} }\n', '\n{"index": {} }\n', '\n')) // '{"docs":[', ',', ']}'))
  .pipe(outputStream);
