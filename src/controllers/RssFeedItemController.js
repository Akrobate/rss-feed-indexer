'use strict';

const {
    RssFeedItemService,
} = require('../services');


class RssFeedItemController {

    // eslint-disable-next-line require-jsdoc
    constructor(rss_feed_item_service) {
        this.rss_feed_item_service = rss_feed_item_service;
    }

    // eslint-disable-next-line require-jsdoc
    static getInstance() {
        if (RssFeedItemController.instance === null) {
            RssFeedItemController.instance = new RssFeedItemController(
                RssFeedItemService.getInstance()
            );
        }
        return RssFeedItemController.instance;
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    search(request, response) {
        const {
            limit,
            offset,
            publication_start_date,
            publication_end_date,
        } = request.query;
        return this
            .rss_feed_item_service
            .search({
                limit: Number(limit),
                offset: Number(offset),
                publication_end_date,
                publication_start_date,
            })
            .then((data) => response.status(200).send({
                count: data.length,
                rss_item_list: data,
            }));
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    normalizedSearch(request, response) {
        const {
            limit,
            offset,
            publication_start_date,
            publication_end_date,
            daily_aggregation,
        } = request.body;
        return this
            .rss_feed_item_service
            .normalizedSearch({
                daily_aggregation: daily_aggregation ? daily_aggregation : false,
                limit: Number(limit),
                offset: Number(offset),
                publication_end_date,
                publication_start_date,
            })
            .then((data) => response.status(200).send({
                count: data.length,
                rss_item_list: data,
            }));
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    count(request, response) {
        const {
            publication_start_date,
            publication_end_date,
            daily_aggregation,
        } = request.body;
        return this
            .rss_feed_item_service
            .count({
                daily_aggregation: daily_aggregation ? daily_aggregation : false,
                publication_end_date,
                publication_start_date,
            })
            .then((data) => response.status(200).send({
                rss_item_count_list: data,
            }));
    }
}

RssFeedItemController.instance = null;

module.exports = {
    RssFeedItemController,
};
