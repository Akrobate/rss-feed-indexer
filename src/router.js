'use strict';

const {
    Router,
} = require('express');

const {
    RssFeedItemController,
} = require('./controllers');
const base_url = '/api';
const route_collection = Router(); // eslint-disable-line new-cap

route_collection
    .get(
        '/ping',
        (_, response) => response.status(200).send({
            pong: true,
        })
    );

route_collection.get(
    '/rss-feed-items',
    (request, response) => RssFeedItemController
        .getInstance()
        .search(request, response)
);


route_collection.post(
    '/rss-feed-items/normalized',
    (request, response) => RssFeedItemController
        .getInstance()
        .normalizedSearch(request, response)
);

route_collection.post(
    '/rss-feed-items/count',
    (request, response) => RssFeedItemController
        .getInstance()
        .count(request, response)
);


module.exports = {
    base_url,
    route_collection,
};
