'use strict';
const debug = require('debug')('readerApp:reader');
const fs = require('fs');
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(fs.readFile);
const dir1 = process.argv[2]
const file1 = process.argv[3];
const needsToBeOnList = process.argv[4]
const childProcess = require('child_process');

let countriesInDb = readFileAsync(`${__dirname}/${dir1}/${file1}`)
.then((data) => {
  return new Promise((resolve, reject) => {
    debug('db data readfile');
    let str = data.toString('ascii');
    let dataObj = str.split('\n');
    let dataSet = {};
    for (var j in dataObj) {
      dataSet[`${dataObj[j].slice(-2)}`] = dataObj[j].slice(-2);
    }
    resolve(dataSet);
  });
});


function writeToAFile(filename, data) {
  let base = filename.slice(0, -4);
  let date = Date.now();
  // debug(data);
  fs.writeFileSync(`${base}_${date}.txt`, data, 'utf-8');
  childProcess.execSync(`mkdir -p ${dir1}_addtoDB`);
  childProcess.execSync(`mv ./${base}_${date}.txt ./${dir1}_addtoDB`);
}

//comparing needs_to_be_on_with_iso.txt and db data and writing what's missing
let readNeedTOBeOnList = readFileAsync(`${__dirname}/${needsToBeOnList}`)
.then((data) => {
  return new Promise((resolve, reject) => {
    debug('here');
    let dataObj = JSON.parse(data);
    // debug(data);
    let dataSet = {};
    for (var j in dataObj) {
      if(j !== 'total_count'){
        dataSet[`${dataObj[j]}`] = dataObj[j];
      }
    }
    resolve(dataSet);
  });
})

readNeedTOBeOnList.then((data) =>{
  countriesInDb.then((dataObj) => {
    let newData = [];
    for (var k in data) {
      debug(k);
      if (!dataObj.hasOwnProperty(k) && k !== 'total_count') {
        newData.push(k);
      }
    }
    newData.push(newData.length);
    writeToAFile(file1, newData);
  });
})
.catch((err) => {
  debug(err);
});
