'use strict';

const Promise = require('bluebird');
const {
    MongoDbRepository,
} = require('../repositories');

const {
    RssFeedParser,
} = require('./RssFeedParser');

const {
    RssFeedItemQualification,
} = require('./RssFeedItemQualification');

class FeedItemsDownloader {


    // eslint-disable-next-line require-jsdoc
    static get RSS_FEED_ITEMS_COLLECTION_NAME() {
        return 'rss-feed-items';
    }

    // eslint-disable-next-line require-jsdoc
    constructor(
        mongo_db_repository,
        rss_feed_parser,
        rss_feed_item_qualification
    ) {
        this.mongo_db_repository = mongo_db_repository;
        this.rss_feed_parser = rss_feed_parser;
        this.rss_feed_item_qualification = rss_feed_item_qualification;
    }

    // eslint-disable-next-line require-jsdoc
    static getInstance() {
        if (FeedItemsDownloader.instance === null) {
            FeedItemsDownloader.instance = new FeedItemsDownloader(
                MongoDbRepository.getInstance(),
                RssFeedParser.getInstance(),
                RssFeedItemQualification.getInstance()
            );
        }
        return FeedItemsDownloader.instance;
    }

    /**
     * @param {string} feed_rss_url
     * @param {string} rss_feed_url_id
     * @returns {Promise<Object>}
     */
    getItemsFromRssFeedUrl(feed_rss_url, rss_feed_url_id) {
        return this.rss_feed_parser
            .parseRssFeedUrl(feed_rss_url)
            .then((rss_object) => {
                const {
                    items,
                } = rss_object;
                return Promise.mapSeries(items, (item) => {
                    const enriched_item = Object.assign(
                        {},
                        item,
                        {
                            pubDate: new Date(item.pubDate),
                            rss_feed_url_id,
                        }
                    );
                    return this
                        .checkItemExists(enriched_item)
                        .then((data) => {
                            if (data === null) {
                                return this.rss_feed_item_qualification
                                    .qualifyFeedItem(enriched_item)
                                    .then((qualified_item) => this.mongo_db_repository
                                        .insertDocument(
                                            FeedItemsDownloader.RSS_FEED_ITEMS_COLLECTION_NAME,
                                            qualified_item
                                        ));
                            }
                            return null;
                        });
                });
            });
    }

    /**
     * @param {Object} item
     * @returns {Promise}
     */
    checkItemExists(item) {
        const {
            guid,
            rss_feed_url_id,
        } = item;

        return this.mongo_db_repository
            .findDocument(
                FeedItemsDownloader.RSS_FEED_ITEMS_COLLECTION_NAME,
                {
                    guid,
                    rss_feed_url_id,
                }
            );
    }
}

FeedItemsDownloader.instance = null;

module.exports = {
    FeedItemsDownloader,
};

