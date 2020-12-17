'use strict';

let Parser = require('rss-parser');
let parser = new Parser();

parser
    // .parseURL('https://www.reddit.com/.rss')
    .parseURL('https://www.nomination.fr/feed/')
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
    });
