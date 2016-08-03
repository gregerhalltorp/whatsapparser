const Transform = require('stream').Transform;
const createHash = require('crypto').createHash;
// import { Transform } from 'stream';
// import { createHash } from 'crypto';

const splitRegex = /(\d{2}\/\d{2}\/\d{4},\s{1}\d{2}:\d{2}\s{1})/;
const dateRegex = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/;
const msgRegex = /^- (.*): ((?:.|\n)*)/;

const parseDatePart = (data) => {
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
};

const parseMessagePart = (data) => {
  if (!data.length) {
    throw new Error('length cannot be zero in messageparse');
  } else {
    const result = data.match(msgRegex);
    return {
      name: result[1],
      body: result[2].trim(),
    };
  }
};

class Parser extends Transform {
  constructor(options) {
    const newOptions = {
      ...options,
      objectMode: true,
    };
    super(newOptions);
    this.objectMode = true;

    this.message = {};
  }

  _transform(data, encoding, done) {
    if (splitRegex.test(data)) {
      this.message.date = parseDatePart(data);
    } else if (data.length && data.indexOf(':') > -1) {
      const parsedMessage = parseMessagePart(data);
      this.message.name = parsedMessage.name;
      this.message.body = parsedMessage.body;
      this.message.words = parsedMessage.body.split(/\s/);
      this.message.hashId = createHash('sha256')
        .update(`${this.message.date}${this.message.name}${this.message.body}`)
        .digest('hex');
      this.push(this.message);
      this.message = {};
    } else {
      this.message = {};
    }
    done();
  }
}

export default Parser;
module.exports = Parser;
