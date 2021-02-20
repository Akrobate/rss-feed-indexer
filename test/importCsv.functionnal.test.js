'use strict';

const {
    expect,
} = require('chai');

const {
    CsvFileLoader,
} = require('../src/libraries');

const csv_file_loader = CsvFileLoader.getInstance();
const seed_path = './test/seeds/url_source.csv';
const {
    MongoDbRepository,
} = require('../src/repositories/MongoDbRepository');
const mongo_db_repository = MongoDbRepository.getInstance();

describe('CSV Import functionnal test', () => {
    it('Should be able to import csv file', (done) => {
        csv_file_loader
            .loadCsvFileUrlToDatabase(seed_path)
            .then(() => mongo_db_repository
                .findDocumentList('rss-feed-url', {})
                .then((result) => {
                    expect(result).to.be.an('Array');
                    expect(result.length).to.equal(2);
                    done();
                })
            )
            .catch(done);
    });
});
