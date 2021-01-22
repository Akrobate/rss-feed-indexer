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
            company_id_list,
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
                    company_id_list,
                    limit,
                    offset,
                    publication_end_date,
                    publication_start_date,
                },
                {
                    is_visible: true,
                    language_list: ['french'],
                }
            ))
            .then((rss_item_list) => rss_item_list
                .map((item) => this.formatRssItem(item))
            );
    }


    /**
     * @param {Object} criteria
     * @returns {Promise<Array>}
     */
    count(criteria) {
        const {
            daily_aggregation,
            publication_end_date,
            publication_start_date,
            company_id_list,
        } = criteria;

        return this.rss_feed_item_repository
            .countDailyAggregated(
                Object.assign(
                    {},
                    {
                        company_id_list,
                        publication_end_date,
                        publication_start_date,
                    },
                    {
                        is_visible: true,
                        language_list: ['french'],
                    }
                ),
                daily_aggregation
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
    formatRssItem(item) {
        const {
            categories,
            image_url_list,
            image_url,
            title,
            pubDate,
            link,
            contentSnippet,
            tags_list,
            rss_feed_url_id,
            _id,
            item_count,
        } = item;

        return {
            categories: categories ? categories : [],
            id: _id,
            image_url: image_url ? image_url : null,
            image_url_list,
            item_count,
            link,
            publication_date: moment(pubDate).toISOString(),
            rss_feed_url_id,
            summary: contentSnippet,
            tags_list: tags_list ? tags_list : [],
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
