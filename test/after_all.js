'use strict';

const {
    MongoDbRepository,
} = require('../src/repositories/MongoDbRepository');

after((done) => {
    const mongo_db_repository = MongoDbRepository.getInstance();
    mongo_db_repository.closeConnection()
        .then(() => {
            console.log('............... After all Teardown, closing mongoDb connection ..............');
            done();
        });
});
