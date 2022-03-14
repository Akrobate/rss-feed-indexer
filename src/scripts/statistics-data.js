'use strict';


const {
    RssFeedUrlRepository,
} = require('../repositories/');

const rss_feed_url_repository = RssFeedUrlRepository.getInstance();

Promise
    .all([
        rss_feed_url_repository.count({
            rss_available: true,
        }),
        rss_feed_url_repository.count({
            rss_available: false,
        }),
        rss_feed_url_repository.count({
            rss_available: null,
        }),
    ])
    .then((data) => console.log(data));
