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
            publication_start_date,
            publication_end_date,
        } = request.query;
        return this
            .rss_feed_item_service
            .search({
                publication_end_date,
                publication_start_date,
            })
            .then((data) => response.status(200).send({
                count: data.length,
                rss_item_list: data,
            }));
    }
}

RssFeedItemController.instance = null;

module.exports = {
    RssFeedItemController,
};
