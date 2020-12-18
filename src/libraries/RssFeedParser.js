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
    parseRssFeedUrl(url) {
        return this.parser
            .parseURL(url);
    }
}

RssFeedParser.instance = null;

module.exports = {
    RssFeedParser,
};
