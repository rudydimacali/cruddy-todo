const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};


// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // Read from the file
  // set counter === to data + 1
  readCounter((err, data) => {
    if (err) {
      throw 'Unable to read from file.';
    } else {
      counter = (data + 1);
      // Write data + 1 to the file
      writeCounter(counter, (err) => {
        if (err) {
          throw('Unable to write to file.');
        } else {
          console.log("Successfully wrote to file.");
          if (callback) {
            callback(null, zeroPaddedNumber(counter));
          }
        }
      });
    }
  });
  
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
