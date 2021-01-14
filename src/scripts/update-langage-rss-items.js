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
    LanguageDetector,
} = require('../libraries/');


const mongodb_repository = MongoDbRepository.getInstance();
const language_detector = new LanguageDetector();

mongodb_repository.findDocumentList(RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME, {})
    .then((rss_item_list) => {
        logger.log('Document list');
        return Promise.mapSeries(rss_item_list, (rss_item) => {
            const language = language_detector.detectFromRssContentSnippet(rss_item);
            console.log(`${rss_item._id} - ${language}`);

            return mongodb_repository.updateDocument(
                RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                {
                    _id: rss_item._id,
                },
                {
                    language,
                });
        });
    })
    .finally(() => mongodb_repository.closeConnection());
