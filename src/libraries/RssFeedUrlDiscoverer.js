'use strict';

const axios = require('axios');

const {
    RssFeedParser,
} = require('./RssFeedParser');

class RssFeedUrlDiscoverer {

    /* istanbul ignore next */
    /**
     * @returns {RssFeedUrlDiscoverer}
     */
    static getInstance() {
        if (RssFeedUrlDiscoverer.instance === null) {
            RssFeedUrlDiscoverer.instance = new RssFeedUrlDiscoverer(
                RssFeedParser.getInstance()
            );
        }
        return RssFeedUrlDiscoverer.instance;
    }

    /**
     * @param {RssFeedParser} rss_feed_parser
     */
    constructor(rss_feed_parser) {
        this.rss_feed_parser = rss_feed_parser;
    }

    /**
     * @param {String} url
     * @returns {Promise<Object>}
     */
    downloadWebPage(url) {
        return axios.get(url);
    }

    /**
     * @param {string} html_string
     * @returns {Array<string>}
     */
    extractRssFeedUrlFromHtml(html_string) {

        let detection = null;
        const urls = [];
        const rex = /<link[^>]+type\s*=\s*"application\/rss\+xml"[^>]+href="?([^"]+)"?\s[^>]*>/g;

        // eslint-disable-next-line no-cond-assign
        while (detection = rex.exec(html_string)) {
            urls.push(detection[1]);
        }

        const stop_words = ['comments', 'comment'];
        const filtered_urls = urls
            .filter((url) => stop_words.find((word) => url.indexOf(word) !== -1) === undefined);

        const [
            first,
        ] = filtered_urls;
        return first;
    }

    /**
     * @param {string} rss_url
     * @returns {Promise<Boolean>}
     */
    isAvailableRss(rss_url) {
        return this.rss_feed_parser
            .parseRssFeedUrl(rss_url)
            .then(() => true)
            .catch(() => false);
    }
}

RssFeedUrlDiscoverer.instance = null;

module.exports = {
    RssFeedUrlDiscoverer,
};
