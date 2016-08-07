import MongoWriteStream from './MongoWriteStream';
import { createReadStream } from 'fs';
import { Parser, splitter } from './../../dist'; // eslint-disable-line


const mongoWriteStream = new MongoWriteStream({
  db: 'mongodb://localhost:27017/test',
  collection: 'messages',
});

const parser = new Parser();

createReadStream('../../test/test.txt', { flags: 'r' })
  .pipe(splitter)
  .pipe(parser)
  .pipe(mongoWriteStream);
