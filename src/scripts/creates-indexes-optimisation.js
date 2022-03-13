/* istanbul ignore file */

'use strict';

const {
    MongoDbRepository,
    RssFeedItemRepository,
    RssFeedUrlRepository,
} = require('../repositories/');

const mongodb_repository = MongoDbRepository.getInstance();
const rss_feed_item_repository = RssFeedItemRepository.getInstance();
const rss_feed_url_repository = RssFeedUrlRepository.getInstance();


Promise
    .all([
        rss_feed_item_repository
            .createIndexForExistanceCheck(),
        rss_feed_url_repository
            .createIndexForExistanceCheck(),
    ])
    .then(console.log)
    .catch(console.log)
    .finally(() => {
        console.log('Exiting process');
        mongodb_repository.closeConnection();
        // eslint-disable-next-line no-process-exit
        process.exit();
    });
