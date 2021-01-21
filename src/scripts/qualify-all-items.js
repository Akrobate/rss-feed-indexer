'use strict';

const Promise = require('bluebird');

const {
    logger,
} = require('../logger');

const {
    MongoDbRepository,
    RssFeedItemRepository,
} = require('../repositories/');
const {
    RssFeedItemQualification,
} = require('../libraries/');

const mongodb_repository = MongoDbRepository.getInstance();
const rss_feed_item_qualification = RssFeedItemQualification.getInstance();

const concurrency = 150;

// Only not qualified feeds
let criteria = {
    is_visible: null,
};

// All feeds
criteria = {};

mongodb_repository
    .findDocumentList(
        RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
        criteria
    )
    .then((rss_item_list) => {
        logger.log('All rss loaded');
        return Promise.map(
            rss_item_list,
            (rss_item) => {
                logger.log(`${rss_item._id} - Qualifying`);

                return rss_feed_item_qualification
                    .qualifyFeedItem(rss_item)
                    .then((qualified_item) => {
                        logger.log(`${rss_item._id} - Ok`);
                        mongodb_repository.updateDocument(
                            RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                            {
                                _id: rss_item._id,
                            },
                            qualified_item
                        );
                    })
                    .catch((error) => {
                        logger.log('NOK', error);
                    });
            },
            {
                concurrency,
            }
        );
    })
    .finally(() => mongodb_repository.closeConnection());
