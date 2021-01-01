'use strict';

const express = require('express');

const {
    base_url,
    route_collection,
} = require('./router');

// const path = require('path');
// const cookieParser = require('cookie-parser');

const app = express();

// Headers middleware
app.use((request, response, next) => {
    if (request.headers) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        response.header('Access-Control-Allow-Credentials', 'false');
    }
    return next();
});

app.use(express.json());
app.use(express.urlencoded({
    extended: false,
}));

app.use(base_url, route_collection);

// catch 404
app.use((request, result) => result.status(404).send({}));

// error management
app.use((error, request, response, next) => {
    response.status(500).send({
        error: error.message,
    });
    next();
});

module.exports = {
    app,
};
