'use strict';

const {
    stub,
} = require('sinon');

const {
    configuration,
} = require('../src/configuration');

const stubs = {};

before((done) => {
    stubs.database_name = stub(configuration.storage.mongodb, 'database_name').value('test-database');

    console.log('............... Before all, setting up configuration ..............');
    done();
});
