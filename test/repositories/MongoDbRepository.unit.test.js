'use strict';

const {
    expect,
} = require('chai');
const {
    MongoDbRepository,
} = require('../../src/repositories/MongoDbRepository');
const mongo_db_repository = MongoDbRepository.getInstance();

const test_collection = 'test-collection-unit-tests';

// eslint-disable-next-line func-names
describe('MongoDbRepository unit test', function() {

    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);

    describe('Test suite create / delete collection', () => {

        it('Should be able to createCollectionIfNotExists (when not exists)', (done) => {
            mongo_db_repository.createCollectionIfNotExists(test_collection)
                .then(() => Promise
                    .resolve(
                        mongo_db_repository.useDataBase(MongoDbRepository.DATABASE_NAME)
                    )
                    .then((dbo) => dbo.collections())
                    .then((collection_list) => {
                        if (!collection_list.map((colection) => colection.s.namespace.collection)
                            .includes(test_collection)) {
                            return done(new Error('Collection was not created'));
                        }
                        return done();
                    })
                )
                .catch(done);
        });

        it('Should be able to createCollectionIfNotExists (when exists)', (done) => {
            mongo_db_repository.createCollectionIfNotExists(test_collection)
                .then((result) => {
                    expect(result).to.equal(true);
                    done();
                })
                .catch(done);
        });

        it('Should be able to dropCollection', (done) => {
            mongo_db_repository.dropCollection(test_collection)
                .then(() => Promise
                    .resolve(
                        mongo_db_repository.useDataBase(MongoDbRepository.DATABASE_NAME)
                    )
                    .then((dbo) => dbo.collections())
                    .then((collection_list) => {
                        if (!collection_list.map((colection) => colection.s.namespace.collection)
                            .includes(test_collection)) {
                            return done();
                        }
                        return done('Collection wan not removed');
                    })
                )
                .catch(done);
        });
    });

});
