'use strict';
const debug = require('debug')('readerApp:cleanup');
const fs = require('fs');
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(fs.readFile);
const file1 = process.argv[2];
const file2 = process.argv[3];


function writeToAFile(filename, data) {
  let base = filename.slice(0, -4);
  let date = Date.now();
  debug(data);
  fs.writeFileSync(`${base}_${date}.txt`, data, 'utf-8');
}

let readInDBData = readFileAsync(`./${file1}`)
  .then((data) => {
    return new Promise((resolve, reject) => {
      debug('readInDBData...');
      let str = data.toString('ascii');
      let dataObj = str.split('\n');
      let dataSet = {};
      for (var j in dataObj) {
        dataSet[`${dataObj[j].toUpperCase()}`] = dataObj[j];
      }
      resolve(dataSet);
    })
    .catch((err) => {
      reject(err);
    });
  });

  let readInCurrentAlexList = readFileAsync(`./${file2}`)
    .then((data) => {
      return new Promise((resolve, reject) => {
        debug('readInDBData...');
        let str = data.toString('ascii');
        let dataObj = str.split('\n');
        let dataSet = {};
        for (var j in dataObj) {
          dataSet[`${dataObj[j].toUpperCase()}`] = dataObj[j];
        }
        resolve(dataSet);
      })
      .catch((err) => {
        reject(err);
      });
    });

    readInDBData.then((dbData) => {

      readInCurrentAlexList.then((alexData) => {
        for (var i in dbData) {
          if (!alexData.hasOwnProperty(i)) {
            debug(i);
          }
        }
      });
    });
