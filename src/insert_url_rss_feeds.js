'use strict';

const Promise = require('bluebird');
const {
    CsvFile,
    MongoDbRepository,
} = require('./libraries');

const source_file = './data/sources/WordPress.csv';
const rss_feed_url_collection_name = 'rss-feed-url';

const csv_file = CsvFile.getInstance();
const mongodb_repository = MongoDbRepository.getInstance();

const website_url_to_insert = [];
let website_url_to_insert_count = 0;
mongodb_repository
    .createCollectionIfNotExists(rss_feed_url_collection_name)
    .then(() => csv_file.readLinePerLineCsvFile(source_file, (data) => {
        website_url_to_insert.push(data);
        website_url_to_insert_count += 1;
    }))
    .then(() => {
        return Promise.mapSeries(
            website_url_to_insert,
            (data) => {
                // console.log('Remaining documents to insert: ' + website_url_to_insert_count--)
                return mongodb_repository.findDocument(rss_feed_url_collection_name, {
                    website_url: data.website_url,
                })
                .then((found_document) => {
                    if (found_document === null) {
                        return mongodb_repository.insertDocument(rss_feed_url_collection_name, {
                                id: Number(data.id),
                                website_url: data.website_url
                            })
                                .catch(console.log);
                    }
                });
            }
        );
    })
    .then(() => {
        return mongodb_repository.closeConnection();
    });