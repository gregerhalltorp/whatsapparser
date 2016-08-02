import { expect } from 'chai';
import { parseDatePart, parseMessagePart } from '../server';


describe('messageParsing', () => {
  describe('parseDatePart', () => {
    const dateString = '23/10/2015, 20:57';
    const dateParseResult = parseDatePart(dateString);

    it('should return a Date', () => {
      expect(dateParseResult instanceof Date).to.equal(true);
    });
    it('should return the correct year', () => {
      expect(dateParseResult.getFullYear()).to.equal(2015);
    });
    it('should return the correct month', () => {
      expect(dateParseResult.getMonth()).to.equal(9);
    });
    it('should return the correct day', () => {
      expect(dateParseResult.getDate()).to.equal(23);
    });
    it('should return the correct hour', () => {
      expect(dateParseResult.getHours()).to.equal(20);
    });
    it('should return the correct minute', () => {
      expect(dateParseResult.getMinutes()).to.equal(57);
    });
  });

  describe('parseMessagePart', () => {
    const messageString = '- Markus Holmgren: Hej hej,\nTerminal och tid för utflight?\n(Då kan man gräva själv ang flighten...😉)\nDet vi undrar är väsentligt... Det är skillnaden... hihi.\n'; // eslint-disable-line max-len
    const messageResult = parseMessagePart(messageString);

    it('should return an object', () => {
      expect(typeof messageResult).to.equal('object');
    });
    it('should contain name property', () => {
      expect(Object.keys(messageResult).indexOf('name')).to.be.above(-1);
    });
    it('should have correct name', () => {
      expect(messageResult.name).to.equal('Markus Holmgren');
    });
    it('should have a body property', () => {
      expect(Object.keys(messageResult).indexOf('body')).to.be.above(-1);
    });
    it('body should not end in "\n"', () => {
      expect(messageResult.body[messageResult.body.length - 1]).to.not.equal('\n');
    });
  });
});
