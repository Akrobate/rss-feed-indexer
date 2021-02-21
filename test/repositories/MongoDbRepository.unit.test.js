'use strict';

const {
    RssFeedItemRepository,
} = require('../../src/repositories');

const {
    expect,
} = require('chai');
const {
    MongoDbRepository,
} = require('../src/repositories/MongoDbRepository');
const mongo_db_repository = MongoDbRepository.getInstance();

const test_collection = 'test-collection-unit-tests';

// eslint-disable-next-line func-names
describe('MongoDbRepository unit test', function() {

    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);

    it('Should be able to createCollectionIfNotExists', (done) => {

        mongo_db_repository.createCollectionIfNotExists(test_collection)
            .then(() => done())
            .catch(done);
    });

});
