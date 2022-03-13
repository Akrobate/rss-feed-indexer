/* eslint-disable sort-keys */
/* istanbul ignore file */

'use strict';

const {
    logger,
} = require('../logger');
const {
    CsvFileLoader,
} = require('../libraries');

const source_file = `${__dirname}/../../data/sources/companies_site_web-13-03-2022.csv`;
const csv_file_loader = CsvFileLoader.getInstance();

logger.log('Start importing url');
csv_file_loader
    .loadCsvFileUrlToDatabase(source_file)
    .then(() => logger.info('Importing finished'));
