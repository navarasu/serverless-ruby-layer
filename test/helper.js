const { spawnSync } = require('child_process');
const fs = require('fs-extra');
const JSZip = require('jszip')
const Promise = require('bluebird');
const path = require('path');

function runCommand(cmd,args,options) {
  const ps = spawnSync(cmd, args,options);
  console.log(ps.stderr.toString())
  console.log(ps.stdout.toString());
  if (ps.error) {
    throw new Error(ps.error);
  } else if (ps.status !== 0) {
    throw new Error(ps.stderr);
  }
  return ps.stdout.toString().trim();
}

function readZip(filePath){
  Promise.promisifyAll(fs);
  return fs.readFileAsync(filePath).then(function (data) {
          return JSZip.loadAsync(data)
                .then(function (zip) {
                    let check = []
                    zip.forEach(function (relativePath, file){
                      if (file.dir && relativePath.split(path.sep).length <= 4){
                          check.push(relativePath)
                      } else if (relativePath.split(path.sep).length <= 1) {
                            check.push(relativePath)
                      }
                    })
                    return check
                  })
         })
}
module.exports = { runCommand,readZip };
