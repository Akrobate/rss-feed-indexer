'use strict';

const {
    expect,
} = require('chai');

const {
    mock,
} = require('sinon');

const axios = require('axios');

const {
    RssFeedParser,
    RssFeedUrlDiscoverer,
    RssFeedUrlDiscovererRules,
} = require('../../src/libraries');

describe('RssFeedUrlDiscovererRules unit test', () => {

    const rss_feed_url_discoverer_rules = RssFeedUrlDiscovererRules.getInstance();
    const rss_feed_url_discoverer = RssFeedUrlDiscoverer.getInstance();
    const rss_feed_parser = RssFeedParser.getInstance();
    const mocks = {};

    beforeEach((done) => {
        mocks.rss_feed_parser = mock(rss_feed_parser);
        mocks.rss_feed_url_discoverer = mock(rss_feed_url_discoverer);
        mocks.axios = mock(axios);
        done();
    });

    afterEach((done) => {
        mocks.rss_feed_parser.restore();
        mocks.rss_feed_url_discoverer.restore();
        mocks.axios.restore();
        done();
    });

    it('rssFeedDiscover', (done) => {
        const website_url = 'http://someurl.fr';
        const html_string = `
            <!DOCTYPE html>
            <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
            <head>
            <link href='https://www.blogger.com/static/v1/widgets/14020288-widget_css_bundle.css' rel='stylesheet' type='text/css'/>
            <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/>
            <meta content='blogger' name='generator'/>
            <link href='http://artiom-fedorov.blogspot.com/favicon.ico' rel='icon' type='image/x-icon'/>
            <link href='http://artiom-fedorov.blogspot.com/' rel='canonical'/>
            <link rel="alternate" type="application/atom+xml" title="Artiom FEDOROV Blog - Atom" href="http://artiom-fedorov.blogspot.com/feeds/posts/default" />
            <link rel="alternate" type="application/rss+xml" title="Artiom FEDOROV Blog - RSS" href="http://artiom-fedorov.blogspot.com/feeds/posts/default?alt=rss" />
            <link rel="service.post" type="application/atom+xml" title="Artiom FEDOROV Blog - Atom" href="https://www.blogger.com/feeds/294242587156974763/posts/default" />
            <link rel="me" href="https://www.blogger.com/profile/17545850288678807424" />
            <!--Can't find substitution for tag [blog.ieCssRetrofitLinks]-->
            <meta content='http://artiom-fedorov.blogspot.com/' property='og:url'/>"
        `;

        mocks.axios
            .expects('get')
            .once()
            .withArgs(website_url)
            .returns(Promise.resolve({
                data: html_string,
                status: 200,
            }));

        rss_feed_url_discoverer_rules
            .rssFeedDiscover(website_url)
            .then((data) => {
                console.log(data);
                // expect().to.equal('http://artiom-fedorov.blogspot.com/feeds/posts/default?alt=rss');
                done();
            })
            .catch(done);
    });

});

