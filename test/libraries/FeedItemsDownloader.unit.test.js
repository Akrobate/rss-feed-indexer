'use strict';

const fs = require('fs');
const {
    mock,
} = require('sinon');
const {
    FeedItemsDownloader,
} = require('../../src/libraries');
const {
    RssFeedParser,
} = require('../../src/libraries');

describe('FeedItemsDownloader', () => {

    const mocks = {};

    beforeEach(() => {
        mocks.rss_feed_parser = mock(RssFeedParser.getInstance());
    });

    afterEach(() => {
        mocks.rss_feed_parser.restore();
    });

    it.skip('FeedItemsDownloader', (done) => {

        const url_rss_feed = 'https://www.nomination.fr/feed';
        mocks.rss_feed_parser
            .expects('parseRssFeedUrl')
            .withArgs(url_rss_feed)
            .returns((() => Promise
                .resolve(JSON.parse(fs.readFileSync('./test/seeds/feed_rss_result'))))());

        const feed_items_downloader = FeedItemsDownloader.getInstance();
        feed_items_downloader
            .getItemsFromRssFeedUrl(url_rss_feed)
            .then((data) => {
                console.log(data.items[0].guid);
                // fs.writeFileSync('./test/seeds/feed_rss_result', JSON.stringify(data));
                done();
            });
    });

    it('FeedItemsDownloader', (done) => {
        const rss_feed_url_id = '2213';
        const url_rss_feed = 'https://www.nomination.fr/feed';

        const feed_items_downloader = FeedItemsDownloader.getInstance();
        feed_items_downloader
            .getItemsFromRssFeedUrl(url_rss_feed, rss_feed_url_id)
            .then((data) => {
                console.log(data);
                // fs.writeFileSync('./test/seeds/feed_rss_result', JSON.stringify(data));
                done();
            })
            .catch(console.log);
    });

    it('FeedItemsDownloader should catch error', (done) => {
        const rss_feed_url_id = '2213';
        const url_rss_feed = 'https://www.nomination.fr/feedss';

        const feed_items_downloader = FeedItemsDownloader.getInstance();
        feed_items_downloader
            .getItemsFromRssFeedUrl(url_rss_feed, rss_feed_url_id)
            .catch(() => done());
    });


    it.skip('Check element exists', (done) => {
        const feed_items_downloader = FeedItemsDownloader.getInstance();
        const guid = '321';
        const rss_feed_url_id = '2213';

        feed_items_downloader
            .checkItemExists({
                guid,
                rss_feed_url_id,
            })
            .then((data) => {
                console.log('----------------', data);
                done();
            })
            .catch(done);
    });

});
