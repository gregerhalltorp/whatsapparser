import { Transform } from 'stream';
import * as split from 'split';
import { stringify } from 'JSONStream';
import { createHash } from 'crypto';
import { through } from 'event-stream';

const splitRegex = /(\d{2}\/\d{2}\/\d{4},\s{1}\d{2}:\d{2}\s{1})/;
const dateRegex = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/;
const msgRegex = /^- (.*): ((?:.|\n)*)/;

export function parseDatePart(data) {
  if (!data.length) {
    throw new Error('length cannot be zero in dateparse');
  }
  const result = data.match(dateRegex);
  const year = parseInt(result[3], 10);
  const month = parseInt(result[2], 10) - 1;
  const day = parseInt(result[1], 10);
  const date = new Date(year, month, day);
  const hour = parseInt(result[4], 10);
  const minute = parseInt(result[5], 10);
  date.setHours(hour, minute);
  return date;
}

export function parseMessagePart(data) {
  if (!data.length) {
    throw new Error('length cannot be zero in messageparse');
  } else {
    const result = data.match(msgRegex);
    // console.log(result[2].split(/\s/));
    return {
      name: result[1],
      body: result[2].trim(),
    };
  }
}

export const server = () => {
  let message = {};
  const parser = new Transform({
    objectMode: true,
    transform(data, encoding, done) {
      if (splitRegex.test(data)) {
        message.date = parseDatePart(data);
      } else if (data.length && data.indexOf(':') > -1) {
        const parsedMessage = parseMessagePart(data);
        message.name = parsedMessage.name;
        message.body = parsedMessage.body;
        message.words = parsedMessage.body.split(/\s/);
        message.hashId = createHash('sha256').update(`${message.date}${message.name}${message.body}`).digest('hex');
        this.push(message);
        message = {};
      } else {
        message = {};
      }
      done();
    },
  });


  const jsonToStrings = stringify(false);

  const tempothing = [];
  process.stdin
    .pipe(split.default(splitRegex))
    .pipe(parser)
    .pipe(through(data => {
      tempothing.push(data);
    }, () => { console.log(tempothing); }));
    // .pipe(jsonToStrings)
    // .pipe(process.stdout);
};
