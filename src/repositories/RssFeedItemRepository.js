/* eslint-disable sort-keys */
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
        } = criteria;

        const query = this.formatSearchCriteria(criteria);

        return this
            .mongo_db_repository
            .findDocumentList(
                RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                query,
                limit,
                offset,
                undefined,
                {
                    pubDate: -1,
                }
            );
    }

    /**
     * @param {Object} criteria
     * @returns {Promise}
     */
    searchDailyAggregated(criteria) {
        const aggregation = [
            {
                $match: this.formatSearchCriteria(criteria),
            },
            {
                $group: {
                    _id: {
                        rss_feed_url_id: '$rss_feed_url_id',
                        date: {
                            $dateToString: {
                                date: '$pubDate',
                                format: '%Y-%m-%d',
                            },
                        },
                    },
                    item_count: {
                        $sum: 1,
                    },
                    first: {
                        $first: '$$ROOT',
                    },
                },
            },
            {
                $sort: {
                    'first.pubDate': -1,
                },
            },
        ];

        return this
            .mongo_db_repository
            .aggregate(
                RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                aggregation
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
            language_list,
        } = criteria;

        const query = {};

        if (publication_end_date) {
            query.pubDate = Object.assign({}, query.pubDate, {
                $gte: new Date(publication_end_date),
            });
        }

        if (publication_start_date) {
            query.pubDate = Object.assign({}, query.pubDate, {
                $lte: new Date(publication_start_date),
            });
        }

        if (language_list) {
            query.language = Object.assign({}, query.language, {
                $in: language_list,
            });
        }

        return query;
    }
}

RssFeedItemRepository.instance = null;

module.exports = {
    RssFeedItemRepository,
};
