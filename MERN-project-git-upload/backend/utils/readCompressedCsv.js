const fs = require('fs')
const csv = require('csv-parser')
const zlib = require("zlib")

// function to read compressed csv-s
const readCompressedCsv = async (file) => {
    try {
        // table to keep json objects from csv
        const results = []
        // create reading stream, decompress and parse csv file
        const csvReadStream = fs.createReadStream(file).pipe(zlib.createGunzip()).pipe(csv({ separator: ';' }))
            
        // return a promise
        return new Promise((resolve, reject) => {
            csvReadStream.on("data", (data) => {
                results.push(data);
            });
            csvReadStream.on("end", () => {
                console.log("Parsing completed successfully");
                resolve(results);
            });
            csvReadStream.on("error", (err) => {
                reject(err);
            });
        });
    } catch (err) {
      throw err;
    }
}

module.exports = { readCompressedCsv }