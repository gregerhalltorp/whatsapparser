/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { createReadStream } from 'fs';
import { split, through } from 'event-stream';
import Parser from '../index';

const setup = () => {
  const splitRegex = /(\d{2}\/\d{2}\/\d{4},\s{1}\d{2}:\d{2}\s{1})/;
  const parser = new Parser();

  const getMessages = new Promise(
    (resolve, reject) => { // eslint-disable-line no-unused-vars
      const tempMsgs = [];
      createReadStream('test.txt', { flags: 'r' })
      .pipe(split(splitRegex))
      .pipe(parser)
      .pipe(through(
        data => {
          tempMsgs.push(data);
        },
        () => {
          resolve(tempMsgs);
        }
      ));
    }
  );

  return getMessages;
};

describe('Message Parsing', () => {
  let messages = [];
  before(() => setup().then(result => { messages = result; }));

  describe('Basic stuff', () => {
    it('should make messages an array', () => {
      expect(messages).to.be.an('array');
    });
    it('should contain the correct number of messages', () => {
      expect(messages.length).to.equal(26);
    });
    it('should make each message a non-null object', () => {
      messages.forEach(message => {
        expect(message).to.not.be.null;
        expect(message).to.be.an('object');
      });
    });
    it('should give all messages a date property of Date type', () => {
      messages.forEach(message => {
        expect(message).to.have.property('date');
        expect(message.date).to.be.a('date');
      });
    });
    it('should give all messages a name property of string type', () => {
      messages.forEach(message => {
        expect(message).to.have.property('name');
        expect(message.name).to.be.a('string');
      });
    });
    it('should give all messages a body property of string type', () => {
      messages.forEach(message => {
        expect(message).to.have.property('body');
        expect(message.body).to.be.a('string');
      });
    });
    it('should give all messages a hashId property of string type', () => {
      messages.forEach(message => {
        expect(message).to.have.property('hashId');
        expect(message.hashId).to.be.a('string');
      });
    });
    it('should give all messages a words property of array type', () => {
      messages.forEach(message => {
        expect(message).to.have.property('words');
        expect(message.words).to.be.an('array');
      });
    });
  });

  describe('parseDatePart', () => {
    it('should give first message the correct year', () => {
      expect(messages[0].date.getFullYear()).to.equal(2015);
    });
    it('should give first message the correct month', () => {
      expect(messages[0].date.getMonth()).to.equal(9);
    });
    it('should give first message the correct day', () => {
      expect(messages[0].date.getDate()).to.equal(23);
    });
    it('should give first message the correct hour', () => {
      expect(messages[0].date.getHours()).to.equal(20);
    });
    it('should give first message the correct minute', () => {
      expect(messages[0].date.getMinutes()).to.equal(57);
    });
  });

  describe('parseMessagePart', () => {
    it('should give last message the correct name', () => {
      expect(messages[messages.length - 1].name).to.equal('Markus Holmgren');
    });
    it('should remove trailing "\\n"', () => {
      const thisMessage = messages[messages.length - 1];
      expect(thisMessage.body[thisMessage.body.length - 1]).to.not.equal('\n');
    });
    it('should make the word list of the correct length', () => {
      expect(messages[messages.length - 1].words.length).to.equal(27);
    });
  });
});
