'use strict';

const Parser = require('rss-parser');

class RssFeedParser {

    /**
     * @returns {RssFeedParser}
     */
    static getInstance() {
        if (RssFeedParser.instance === null) {
            RssFeedParser.instance = new RssFeedParser(
                new Parser()
            );
        }
        return RssFeedParser.instance;
    }

    /**
     * @param {Parser} parser
     */
    constructor(parser) {
        this.parser = parser;
    }

    /**
     * @param {String} url
     * @returns {Promise<Object>}
     */
    parseRssFeedUrlWithUrlCheck(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                return reject(new Error('INVALID_PARAM_URL'));
            }
            return this.parseRssFeedUrl(url)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * @param {String} url
     * @returns {Promise<Object>}
     */
    parseRssFeedUrl(url) {
        return this.parser
            .parseURL(url);
    }

    /**
     * @param {*} website_url
     * @returns {String}
     */
    generateDefaultFeedUrlFromWebsiteUrl(website_url) {
        return `${website_url}/feed`.replace('//feed', '/feed');
    }

}

RssFeedParser.instance = null;

module.exports = {
    RssFeedParser,
};
