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

let givenListData = readFileAsync(`${__dirname}/${file1}`)
.then((data) => {
  return new Promise((resolve, reject) => {
    debug('readfile');
    let str = data.toString('ascii');
    let dataObj = str.split('\n');
    let dataSet = {};
    for (var j in dataObj) {
      dataSet[`${dataObj[j].toLowerCase()}`] = dataObj[j];
    }
    resolve(dataSet);
  })
  .catch((err) => {
    reject(err);
  });
});

let isoList = readFileAsync(`${__dirname}/${file2}`)
.then((data) => {
  return new Promise((resolve, reject) => {
    debug('readfile iso file');
    let str = data.toString('ascii');
    let dataObj = str.split('\n');
    let dataSet = {};
    for (var j in dataObj) {
      var originalObj = dataObj[j].substring(0, -2);
      var len = dataObj[j].length - 3;
      dataSet[`${dataObj[j].substring(0,len).toLowerCase()}`] = dataObj[j].slice(-2);
    }
    resolve(dataSet);
  })
  .catch((err) => {
    reject(err);
  });
});

isoList.then((isoData) => {
  let arr = [];
  let arr2 = [];
  let unknownCountryCode = {};
  let countryCodeExist = {};
  givenListData.then((listData) => {
    for (var i in listData) {
      debug(i);
      if (!isoData.hasOwnProperty(i)) {
        arr.push(unknownCountryCode[`${i}`] = 'unknown_country_code');
      } else if (i == "") {
        debug('empty string');
      }
      else {
        countryCodeExist[`${i}`] = isoData[i];
      }
    }
    arr.push(countryCodeExist['total_count'] = Object.keys(countryCodeExist).length);
    arr.push(unknownCountryCode['total_count'] = Object.keys(unknownCountryCode).length);
    writeToAFile('needs_to_be_on_with_iso.txt',JSON.stringify(countryCodeExist, null, 4));
    writeToAFile('unknown_country_code.txt', JSON.stringify(unknownCountryCode, null, 4));
  });
});
