/* eslint-disable sort-keys */

'use strict';

const {
    MongoDbRepository,
} = require('./MongoDbRepository');

class RssFeedUrlRepository {

    // eslint-disable-next-line require-jsdoc
    static get RSS_URL_ITEMS_COLLECTION_NAME() {
        return 'rss-feed-url';
    }

    // eslint-disable-next-line require-jsdoc
    constructor(mongo_db_repository) {
        this.mongo_db_repository = mongo_db_repository;
    }

    /* istanbul ignore next */
    // eslint-disable-next-line require-jsdoc
    static getInstance() {
        if (RssFeedUrlRepository.instance === null) {
            RssFeedUrlRepository.instance = new RssFeedUrlRepository(
                MongoDbRepository.getInstance()
            );
        }
        return RssFeedUrlRepository.instance;
    }


    /**
     * While script is running it checks for existence of
     * items by guid and rss_feed_url_id
     * This method creates the multi index on this two fields
     * @return {Promise}
     */
    createIndexForExistanceCheck() {
        return this.mongo_db_repository
            .createIndex(
                RssFeedUrlRepository.RSS_URL_ITEMS_COLLECTION_NAME,
                {
                    website_url: 1,
                }
            );
    }

    /**
     * @returns {Promise}
     */
    closeConnection() {
        return this.mongo_db_repository.closeConnection();
    }

}

RssFeedUrlRepository.instance = null;

module.exports = {
    RssFeedUrlRepository,
};
