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
            company_id_list,
            limit,
            offset,
            publication_start_date,
            publication_end_date,
            daily_aggregation,
        } = request.body;

        // eslint-disable-next-line init-declarations
        let company_id_list_param;
        if (Array.isArray(company_id_list) && company_id_list.length) {
            company_id_list_param = company_id_list;
        }
        return this
            .rss_feed_item_service
            .normalizedSearch({
                // eslint-disable-next-line eqeqeq
                // company_id_list: company_id_list == true ? company_id_list : undefined,
                company_id_list: company_id_list_param,
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
            company_id_list,
            publication_start_date,
            publication_end_date,
            daily_aggregation,
        } = request.body;
        // eslint-disable-next-line init-declarations
        let company_id_list_param;
        if (Array.isArray(company_id_list) && company_id_list.length) {
            company_id_list_param = company_id_list;
        }
        return this
            .rss_feed_item_service
            .count({
                company_id_list: company_id_list_param,
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
