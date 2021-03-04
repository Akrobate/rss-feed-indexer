'use strict';

const axios = require('axios');

const {
    RssFeedParser,
} = require('./RssFeedParser');
const {
    RssFeedUrlDiscoverer,
} = require('./RssFeedUrlDiscoverer');

class RssFeedUrlDiscovererRules {

    /* istanbul ignore next */
    /**
     * @returns {RssFeedUrlDiscovererRules}
     */
    static getInstance() {
        if (RssFeedUrlDiscovererRules.instance === null) {
            RssFeedUrlDiscovererRules.instance = new RssFeedUrlDiscovererRules(
                RssFeedParser.getInstance(),
                RssFeedUrlDiscoverer.getInstance()
            );
        }
        return RssFeedUrlDiscovererRules.instance;
    }

    /**
     * @param {RssFeedParser} rss_feed_parser
     * @param {RssFeedUrlDiscoverer} rss_feed_url_discoverer
     */
    constructor(rss_feed_parser, rss_feed_url_discoverer) {
        this.rss_feed_parser = rss_feed_parser;
        this.rss_feed_url_discoverer = rss_feed_url_discoverer;
    }


    /**
     * @param {*} website_url
     * @returns {Promise}
     */
    rssFeedDiscover(website_url) {
        const result = {
            resolved_url: null,
            rule_1: null,
            rule_2: null,
            rule_3: null,
            status: null,
        };
        return axios.get(website_url)
            .then((response) => {
                result.status = response.status;
                result.resolved_url = response.request.res.responseUrl;
                // Rule 1
                // Get RSS_FEED_URL from parsed html response data content
                const rss_url_rule1 = this.rss_feed_url_discoverer
                    .extractRssFeedUrlFromHtml(response.data);
                const rss_url_rule2 = this.rss_feed_parser
                    .generateDefaultFeedUrlFromWebsiteUrl(website_url);
                const rss_url_rule3 = this.rss_feed_parser
                    .generateDefaultFeedUrlFromWebsiteUrl(result.resolved_url);

                return this.discoverValidator(rss_url_rule1)
                    .then((data) => {
                        result.rule_1 = data;
                    })
                    .then(() => this.discoverValidator(rss_url_rule2))
                    .then((data) => {
                        result.rule_2 = data;
                    })
                    .then(() => this.discoverValidator(rss_url_rule3))
                    .then((data) => {
                        result.rule_3 = data;
                    });
            })
            .catch((error) => {
                result.status = 0;
                if (error.response) {
                    result.status = error.response.status;
                }
            })
            .then(() => result);
    }

    /**
     * @param {String} feed_rss_url_to_test
     * @return {Promise}
     */
    discoverValidator(feed_rss_url_to_test) {
        const result = {
            error: null,
            feed_url: null,
            item_count: null,
        };
        return this.rss_feed_parser
            .parseRssFeedUrlWithUrlCheck(feed_rss_url_to_test)
            .then((data) => {
                result.feed_url = feed_rss_url_to_test;
                result.item_count = data.items ? data.items.length : 0;
            })
            .catch((error) => {
                // console.log('Error Rule 1', error.message);
                result.error = error.message;
                result.feed_url = feed_rss_url_to_test;
            })
            .then(() => result);
    }
}

RssFeedUrlDiscovererRules.instance = null;

module.exports = {
    RssFeedUrlDiscovererRules,
};
