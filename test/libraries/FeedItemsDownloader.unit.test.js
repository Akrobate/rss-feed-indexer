'use strict';

const fs = require('fs');
const {
    mock,
    stub,
} = require('sinon');
const {
    expect,
} = require('chai');
const {
    FeedItemsDownloader,
} = require('../../src/libraries');
const {
    RssFeedParser,
} = require('../../src/libraries');


const {
    configuration,
} = require('../../src/configuration');

describe('FeedItemsDownloader', () => {

    const mocks = {};
    const stubs = {};
    beforeEach(() => {
        stubs.database_name = stub(configuration.storage.mongodb, 'database_name').value('test-database');
        mocks.rss_feed_parser = mock(RssFeedParser.getInstance());
    });

    afterEach(() => {
        mocks.rss_feed_parser.restore();
        stubs.database_name.restore();
    });

    it('test configuration mock', (done) => {
        expect(configuration.storage.mongodb.database_name).to.equal('test-database');
        done();
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

    it.skip('FeedItemsDownloader', (done) => {
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

    it.skip('FeedItemsDownloader should catch error', (done) => {
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
