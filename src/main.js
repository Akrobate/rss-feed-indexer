'use strict';

const {
    RssFeedParser,
} = require('./libraries/RssFeedParser')

const url = 'http://www.nomination.fr/feed'

RssFeedParser
    .getInstance()
    .parseRssFeedUrl(url)
    .then((feed) => {
        console.log(feed.title);
        feed.items.forEach(item => {
            console.log('item.title')
            console.log(item.title)
            console.log('item.link')
            console.log(item.link)
            console.log(Object.keys(item))
            console.log('------------------------------------------------')
        });
    })
    .catch((error) => {
        console.log(error.message);
    });
