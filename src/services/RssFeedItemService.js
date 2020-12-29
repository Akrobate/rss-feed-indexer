'use strict';

const {
    RssFeedItemRepository,
} = require('./repositories');

class RssFeedItemService {

    // eslint-disable-next-line require-jsdoc
    constructor(rss_feed_item_repository) {
        this.rss_feed_item_repository = rss_feed_item_repository;
    }

    // eslint-disable-next-line require-jsdoc
    getInstance() {
        if (RssFeedItemService.instance === null) {
            RssFeedItemService.instance = new RssFeedItemService(
                RssFeedItemRepository.getInstance()
            );
        }
        return RssFeedItemService.instance;
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @returns {Object}
     */
    search(request, response) {

    }

}

RssFeedItemService.instance = null;

module.exports = {
    RssFeedItemService,
};
