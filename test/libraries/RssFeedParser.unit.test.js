'use strict';

const {
    expect,
} = require('chai');

const {
    mock,
} = require('sinon');

const {
    RssFeedParser,
} = require('../../src/libraries/RssFeedParser');

describe('RssFeedParser unit test', () => {

    const rss_feed_parser = RssFeedParser.getInstance();
    const mocks = {};

    before((done) => {
        mocks.rss_feed_parser = mock(rss_feed_parser);
        done();
    });

    after((done) => {
        mocks.rss_feed_parser.restore();
        done();
    });

    it('generateDefaultFeedUrlFromWebsiteUrl', (done) => {
        expect(
            rss_feed_parser.generateDefaultFeedUrlFromWebsiteUrl('http://www.myurl.com')
        ).to.equal('http://www.myurl.com/feed');
        expect(
            rss_feed_parser.generateDefaultFeedUrlFromWebsiteUrl('http://www.myurl.com/')
        ).to.equal('http://www.myurl.com/feed');
        done();
    });

    it('parseRssFeedUrlWithUrlCheck should reject with bad url', (done) => {
        rss_feed_parser
            .parseRssFeedUrlWithUrlCheck(null)
            .then(() => done('Should reject'))
            .catch(() => done());
    });
    it('parseRssFeedUrlWithUrlCheck should pass if url is ok', (done) => {

        const url = 'http://test.url';
        mocks.rss_feed_parser
            .expects('parseRssFeedUrl')
            .once()
            .withArgs(url)
            .returns(Promise.resolve({}));

        rss_feed_parser
            .parseRssFeedUrlWithUrlCheck(url)
            .then((data) => {
                mocks.rss_feed_parser.verify();
                expect(data).to.deep.equal({});
                done();
            })
            .catch((error) => done(error));
    });

});

