'use strict';

const Promise = require('bluebird');
const {
    logger,
} = require('../logger');
const {
    RssFeedUrlRepository,
} = require('../repositories/');

const rss_feed_url_repository = RssFeedUrlRepository.getInstance();


(async () => {
    const url_availability_statistics = await Promise
        .mapSeries(
            [
                {
                    rss_available: true,
                },
                {
                    rss_available: false,
                },
                {
                    rss_available: null,
                },
                {},
            ],
            (criteria) => rss_feed_url_repository.count(criteria)
        );
    const [
        rss_available_count,
        rss_not_available_count,
        rss_not_tested_count,
        total_count,
    ] = url_availability_statistics;

    logger.log(`Total url count: \t ${total_count}`);
    logger.log(`Found url feeds: \t  ${rss_available_count}`);
    logger.log(`Not available feeds: \t ${rss_not_available_count}`);
    logger.log(`Remain url to test: \t ${rss_not_tested_count}`);

    await rss_feed_url_repository.closeConnection();

})();

