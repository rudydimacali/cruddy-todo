const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");
const Promise = require("bluebird");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${this.dataDir}/${id}.txt`, text, err => {
      if (err) {
        throw "Error creating file.";
      } else if (callback) {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = callback => {
  var promisedReadOne = Promise.promisify(exports.readOne);
  fs.readdir(this.dataDir, (err, files) => {
    if (err) {
      throw "Error reading files.";
    } else {
      var data = _.map(files, file => {
        let id = path.basename(file, ".txt");
        return promisedReadOne(id).then(textInFile => {
          return textInFile;
        });
      });
      Promise.all(data).then(items => {
        callback(null, items);
      });
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${this.dataDir}/${id}.txt`, "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${this.dataDir}/${id}.txt`, text, err => {
        if (err) {
          throw "Error creating file.";
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
      fs.unlink(`${this.dataDir}/${id}.txt`, err => {
        if (err) {
          throw "Error removing file.";
        } else if (callback) {
          callback(err);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
