/* istanbul ignore file */

'use strict';

const Promise = require('bluebird');

const {
    logger,
} = require('../logger');

const {
    FeedItemsDownloader,
} = require('../libraries/');

const {
    MongoDbRepository,
} = require('../repositories/');

const CONCURRENCY = 50;

const mongodb_repository = MongoDbRepository.getInstance();
const feed_items_downloader = FeedItemsDownloader.getInstance();
const RSS_FEED_URL_COLLECTION_NAME = 'rss-feed-url';

mongodb_repository
    .findDocumentList(
        RSS_FEED_URL_COLLECTION_NAME,
        {
            rss_available: true,
        }
    )
    .then((url_row_list) => {
        logger.log('Documents loaded');
        return Promise.map(
            url_row_list,
            (url_row) => {
                logger.log(`Processing - ${url_row.rss_feed_url}`);
                return feed_items_downloader
                    .getItemsFromRssFeedUrl(url_row.rss_feed_url, url_row.id)
                    .then(() => {
                        logger.info('Inserted');
                    })
                    .catch((error) => {
                        logger.info('Error:', error);
                    });
            },
            {
                concurrency: CONCURRENCY,
            }
        );
    })
    .finally(() => {
        console.log('Exiting process');
        mongodb_repository.closeConnection();
        // eslint-disable-next-line no-process-exit
        process.exit();
    });
