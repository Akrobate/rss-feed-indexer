'use strict';

const moment = require('moment');

const {
    RssFeedItemRepository,
} = require('../repositories');

class RssFeedItemService {

    // eslint-disable-next-line require-jsdoc
    constructor(rss_feed_item_repository) {
        this.rss_feed_item_repository = rss_feed_item_repository;
    }

    // eslint-disable-next-line require-jsdoc
    static getInstance() {
        if (RssFeedItemService.instance === null) {
            RssFeedItemService.instance = new RssFeedItemService(
                RssFeedItemRepository.getInstance()
            );
        }
        return RssFeedItemService.instance;
    }


    /**
     * @param {Object} criteria
     * @returns {Promise<Array>}
     */
    normalizedSearch(criteria) {
        const {
            daily_aggregation,
            limit,
            offset,
            publication_end_date,
            publication_start_date,
        } = criteria;

        let type_search = 'search';
        if (daily_aggregation) {
            type_search = 'searchDailyAggregated';
        }

        return this[type_search](
            Object.assign(
                {},
                {
                    limit,
                    offset,
                    publication_end_date,
                    publication_start_date,
                },
                {
                    language_list: ['french'],
                }
            ))
            .then((rss_item_list) => rss_item_list
                .map((item) => this.normalizeRssItem(item))
            );
    }

    /**
     * @param {Object} criteria
     * @returns {Object}
     */
    search(criteria) {
        console.log(criteria);
        return this.rss_feed_item_repository.search(criteria);
    }


    /**
     * @param {Object} criteria
     * @returns {Object}
     */
    searchDailyAggregated(criteria) {
        return this
            .rss_feed_item_repository
            .searchDailyAggregated(criteria)
            .then((response) => response
                .map((item) => this.formatDailyAggregatedResponse(item))
            );
    }

    /**
     * @param {Object} item
     * @return {Object}
     */
    formatDailyAggregatedResponse(item) {
        const {
            first,
            item_count,
        } = item;
        return Object.assign(
            {},
            first,
            {
                item_count,
            }
        );
    }

    /**
     * @param {Object} item
     * @returns {Object}
     */
    normalizeRssItem(item) {
        const {
            categories,
            title,
            pubDate,
            link,
            contentSnippet,
            rss_feed_url_id,
            _id,
            item_count,
        } = item;

        return {
            categories: categories ? categories : [],
            id: _id,
            image_url_list: this.extractImgUrlsFromHtml(item['content:encoded']),
            item_count,
            link,
            publication_date: moment(pubDate).toISOString(),
            rss_feed_url_id,
            summary: contentSnippet,
            title,
        };
    }

    /**
     * @param {string} html_string
     * @returns {Array<string>}
     */
    extractImgUrlsFromHtml(html_string) {
        let detection = null;
        const urls = [];
        const rex = /<img[^>]+src="?([^"]+)"?\s[^>]*>/g;

        // eslint-disable-next-line no-cond-assign
        while (detection = rex.exec(html_string)) {
            urls.push(detection[1]);
        }
        return urls;
    }

}

RssFeedItemService.instance = null;

module.exports = {
    RssFeedItemService,
};
