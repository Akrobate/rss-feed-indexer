'use strict';


const {
    MongoDbRepository,
    RssFeedItemRepository,
} = require('../repositories/');

const mongodb_repository = MongoDbRepository.getInstance();
const rss_feed_item_repository = RssFeedItemRepository.getInstance();


rss_feed_item_repository
    .createIndexForExistanceCheck()
    .then(console.log)
    .catch(console.log)
    .finally(() => {
        console.log('Exiting process');
        mongodb_repository.closeConnection();
        // eslint-disable-next-line no-process-exit
        // process.exit();
    });
