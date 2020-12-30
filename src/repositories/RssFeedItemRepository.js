'use strict';

const {
    MongoDbRepository,
} = require('./MongoDbRepository');

class RssFeedItemRepository {

    // eslint-disable-next-line require-jsdoc
    static get RSS_FEED_ITEMS_COLLECTION_NAME() {
        return 'rss-feed-items';
    }

    // eslint-disable-next-line require-jsdoc
    constructor(mongo_db_repository) {
        this.mongo_db_repository = mongo_db_repository;
    }

    // eslint-disable-next-line require-jsdoc
    static getInstance() {
        if (RssFeedItemRepository.instance === null) {
            RssFeedItemRepository.instance = new RssFeedItemRepository(
                MongoDbRepository.getInstance()
            );
        }
        return RssFeedItemRepository.instance;
    }

    /**
     * @param {Object} criteria
     * @returns {Promise}
     */
    search(criteria) {
        const {
            limit,
            offset,
            publication_end_date,
            publication_start_date,
        } = criteria;

        const query = {};

        query.pubDate = Object.assign({}, query.pubDate, {
            $gte: ISODate(publication_end_date)
        });

        // created_at: {
        //     $gte: ISODate("2010-04-29T00:00:00.000Z"),
        //     $lt: ISODate("2010-05-01T00:00:00.000Z")
        // }

        return this
            .mongo_db_repository
            .findDocumentList(
                RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                query,
                limit,
                offset
            );
    }


    /**
     *
     * @param {Object} criteria
     * @returns {Object}
     */
    formatSearchCriteria(criteria) {

        const {
            publication_end_date,
            publication_start_date,
        } = criteria;

        const query = {};

        if (publication_end_date) {
            query.pubDate = Object.assign({}, query.pubDate, {
                $gte: publication_end_date,
            });
        }

        if (publication_start_date) {
            query.pubDate = Object.assign({}, query.pubDate, {
                $lte: publication_start_date,
            });
        }

        return query;
    }
}

RssFeedItemRepository.instance = null;

module.exports = {
    RssFeedItemRepository,
};
