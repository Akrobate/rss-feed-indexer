'use strict';

const Promise = require('bluebird');
const LanguageDetect = require('languagedetect');

const {
    logger,
} = require('../logger');

const {
    MongoDbRepository,
    RssFeedItemRepository,
} = require('../repositories/');

const mongodb_repository = MongoDbRepository.getInstance();
const language_detector = new LanguageDetect();

function detectLangaguageFromRssItem(rss_item) {
    const {
        contentSnippet,
    } = rss_item;
    const lang_result_detection = language_detector.detect(contentSnippet, 1);

    let lang_result = null;
    const [best_result] = lang_result_detection;

    if (best_result) {
        [lang_result] = best_result;
    }
    return lang_result;
}

mongodb_repository.findDocumentList(RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME, {})
    .then((rss_item_list) => {
        logger.log('Document list');
        return Promise.mapSeries(rss_item_list, (rss_item) => {
            const language = detectLangaguageFromRssItem(rss_item);
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
