import { Writable } from 'stream';
import { MongoClient } from 'mongodb';

class MongoWriteStream extends Writable {
  constructor(options) {
    const newOptions = {
      ...options,
      objectMode: true,
    };
    super(newOptions);

    this.options = options;
  }

  _write(data, encoding, done) {
    const self = this;
    if (!self.db) {
      MongoClient.connect(self.options.db, (err, db) => {
        if (err) {
          throw err;
        }
        self.db = db;
        self.on('finish', () => {
          self.db.close();
        });
        self.collection = db.collection(self.options.collection);
        self.collection.insert(data, { w: 1 }, done);
      });
    } else {
      self.collection.insert(data, { w: 1 }, done);
    }
  }
}

export default MongoWriteStream;
