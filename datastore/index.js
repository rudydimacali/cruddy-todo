const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile((`${this.dataDir}/${id}.txt`), text,
      (err) => {
        if (err) {
          throw ('Error creating file.');
        } else if (callback) {
          callback(null, { id, text });
        }
      });
  });
};

exports.readAll = (callback) => {
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });
  
  // TODO: Refactor with promises.
  var data = [];
  fs.readdir(this.dataDir, (err, files) => {
    if (err) {
      throw ('Error reading files.');
    } else {
      _.each(files, (text, id) => {
        text = text.split('.')[0];
        id = text;
        data.push({id, text});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${this.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile((`${this.dataDir}/${id}.txt`), text,
        (err) => {
          if (err) {
            throw ('Error creating file.');
          } else if (callback) {
            callback(null, { id, text });
          }
        });
    }
  });
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink((`${this.dataDir}/${id}.txt`),
        (err) => {
          if (err) {
            throw ('Error removing file.');
          } else if (callback) {
            callback(err);
          }
        });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
