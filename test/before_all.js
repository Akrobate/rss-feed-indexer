'use strict';

const {
    stub,
} = require('sinon');

const {
    configuration,
} = require('../src/configuration');

const {
    MongoDbRepository,
} = require('../src/repositories/MongoDbRepository');

const stubs = {};

before((done) => {

    const test_database_name = 'test-database';
    stubs.database_name = stub(configuration.storage.mongodb, 'database_name').value(test_database_name);

    MongoDbRepository
        .getInstance()
        .getConnection()
        .then((connection) => connection.db(test_database_name))
        .then((dbo) => dbo.dropDatabase(() => {
            console.log('............... Before all, setting up configuration ..............');
            done();
        }));
});
