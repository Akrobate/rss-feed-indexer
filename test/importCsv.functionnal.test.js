const {
    CsvFileLoader,
} = require('../src/libraries');

const csv_file_loader = CsvFileLoader.getInstance();
const seed_path = './test/seeds/url_source.csv';


describe('CSV Import functionnal test', () => {
    it('Should be able to import csv file', (done) => {
        csv_file_loader
            .loadCsvFileUrlToDatabase(seed_path)
            .then(() => done())
            .catch(done);
    });
});
