/* eslint-disable sort-keys */
/* istanbul ignore file */

'use strict';

const {
    logger,
} = require('../logger');
const {
    CsvFileLoader,
} = require('../libraries');

const source_file = '../data/sources/WordPress.csv';
const csv_file_loader = CsvFileLoader.getInstance();

logger.log('Start importing url');
csv_file_loader
    .loadCsvFileUrlToDatabase(source_file)
    .then(() => logger('Importing finished'));
