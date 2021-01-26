'use strict';

// 55376

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

const CONCURRENCY = 20;

const mongodb_repository = MongoDbRepository.getInstance();
const feed_items_downloader = FeedItemsDownloader.getInstance();
const rss_feed_url_collection_name = 'rss-feed-url';

function updateUrl(_id, data) {
    return mongodb_repository.updateDocument(
        rss_feed_url_collection_name,
        {
            _id,
        },
        {
            last_check_date: new Date(),
            rss_available: data.rss_available,
        });
}

mongodb_repository.findDocumentList(rss_feed_url_collection_name, {})
    .then((url_row_list) => {
        logger.log('Documents loaded');
        return Promise.map(
            url_row_list,
            (url_row) => {
                logger.log(`Processing - ${url_row.rss_feed_url}`);
                return feed_items_downloader
                    .getItemsFromRssFeedUrl(url_row.rss_feed_url, url_row.id)
                    .then(() => {
                        logger.log('Added');
                        return updateUrl(
                            url_row._id,
                            {
                                rss_available: true,
                            }
                        );
                    })
                    .catch((error) => {
                        logger.log(`Error ${error.message}`);
                        return updateUrl(
                            url_row._id,
                            {
                                rss_available: false,
                            }
                        );
                    });
            },
            {
                concurrency: CONCURRENCY,
            });
    })
    .finally(() => {
        console.log('Exiting process');
        mongodb_repository.closeConnection();
        // eslint-disable-next-line no-process-exit
        process.exit();
    });
