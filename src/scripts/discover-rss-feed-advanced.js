/**
 * This script will try to download the main page,
 * then try to discover an rss feed link from raw html
 * if not found will try somme commons url patterns as /feed
 * based on root url, and on resolved url
 *
 * The discovered feed url will be saved
 * The resolved url will be saved
 * The matched strategy will be saved
 * The obtained error will be saved
 */

'use strict';

const {
    default: axios,
} = require('axios');
const {
    MongoDbRepository,
} = require('../repositories');
const {
    RssFeedParser,
    RssFeedUrlDiscoverer,
} = require('../libraries');

const mongodb_repository = MongoDbRepository.getInstance();
const rss_feed_parser = RssFeedParser.getInstance();
const rss_feed_url_discoverer = RssFeedUrlDiscoverer.getInstance();

const URL_TO_TEST_COLLECTION_NAME = 'website-url-discover-rss';
const RSS_FEED_URL_COLLECTION_NAME = 'rss-feed-url';

let website_url_to_insert_count = 0;

// let a = '<link rel="alternate" type ="application/rss+xml" title="CHALON MEGARD &raquo; Flux" href="https://chalonmegard.com/index.php/feed/" />';
// a += '<link rel="alternate" type="application/rss+xml" title="CHALON MEGARD &raquo; Flux des commentaires" href="https://chalonmegard.com/index.php/comments/feed/" />'

const url_to_test = 'http://www.chalonmegard.fr';


function rssFeedExtractor(url = 'https://chalonmegard.com/index.php/feed/') {
    rss_feed_parser.parseRssFeedUrl(url)
        .then((data) => console.log('rss ok'))
        .catch((error) => {
            console.log(error);
            return axios.get(url_to_test)
                .then((response) => {
                    console.log(response.request.res.responseUrl);
                    const rss_url = rss_feed_url_discoverer
                        .extractRssFeedUrlFromHtml(response.data);
                    console.log(rss_url);
                    return rss_url;
                });
        })
        .then((url_rss) => {
            console.log('herrre');
            console.log(url_rss);
        });
}


function copyDataToUrlToTestCollection() {

    const fields = {
        fields: {
            _id: 0,
            last_check_date: 0,
            rss_available: 0,
            rss_feed_url: 0,
        },
    };
    return mongodb_repository
        .createCollectionIfNotExists(URL_TO_TEST_COLLECTION_NAME)
        .then(() => {
            console.log('Collection created');
            return mongodb_repository
                .findDocumentList(
                    RSS_FEED_URL_COLLECTION_NAME, {}, undefined, undefined, fields
                )
                .then((data) => mongodb_repository
                    .insertDocumentList(URL_TO_TEST_COLLECTION_NAME, data));
        })
        .finally(() => mongodb_repository.closeConnection());
}

// copyDataToUrlToTestCollection();


