'use strict';

const fs = require('fs');
const csv = require('csv-parser');

class CsvFile {

    /**
     * @returns {Object}
     */
    static getInstance() {
        if (CsvFile.instance === null) {
            CsvFile.instance = new CsvFile();
        }
        return CsvFile.instance;
    }

    /**
     * @param {*} csv_file
     * @param {*} csv_row_callback
     * @returns {Promise<void>}
     */
    readLinePerLineCsvFile(csv_file, csv_row_callback) {
        return new Promise((resolve, reject) => fs
            .createReadStream(csv_file)
            .on('error', (error) => reject(error))
            .pipe(csv())
            .on('data', (data) => csv_row_callback(data))
            .on('error', (error) => reject(error))
            .on('end', () => resolve())
        );
    }
}

CsvFile.instance = null;

module.exports = {
    CsvFile,
};
