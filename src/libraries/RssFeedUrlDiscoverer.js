'use strict';

const axios = require('axios');

class RssFeedUrlDiscoverer {

    /**
     * @returns {RssFeedUrlDiscoverer}
     */
    static getInstance() {
        if (RssFeedUrlDiscoverer.instance === null) {
            RssFeedUrlDiscoverer.instance = new RssFeedUrlDiscoverer();
        }
        return RssFeedUrlDiscoverer.instance;
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
        // const rex = /<link[^>]+rss\+xml[^>]+href="?([^"]+)"?\s[^>]*>/g;

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
}

RssFeedUrlDiscoverer.instance = null;

module.exports = {
    RssFeedUrlDiscoverer,
};
