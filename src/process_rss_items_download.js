'use strict';

const Promise = require('bluebird');
const {
    FeedItemsDownloader,
    MongoDbRepository,
} = require('./libraries/');

const mongodb_repository = MongoDbRepository.getInstance();
const feed_items_downloader = FeedItemsDownloader.getInstance();
const rss_feed_url_collection_name = 'rss-feed-url';

function updateUrl(data, _id) {
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
        console.log('Document list');
        return Promise.mapSeries(url_row_list, (url_row) => {
            console.log(`Processing - ${url_row.rss_feed_url}`);
            return feed_items_downloader
                .getItemsFromRssFeedUrl(url_row.rss_feed_url, url_row.id)
                .then(() => {
                    console.log('Added');
                    return updateUrl({
                        rss_available: true,
                    }, url_row._id);
                })
                .catch((error) => {
                    console.log(`Error ${error.message}`);
                    return updateUrl({
                        rss_available: false,
                    }, url_row._id);
                });
        });
    })
    .finally(() => mongodb_repository.closeConnection());
