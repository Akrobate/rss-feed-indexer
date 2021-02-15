'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const {
    logger,
} = require('../logger');
const {
    MongoDbRepository,
} = require('../repositories');

class CsvFileLoader {

    /**
     * @static
     */
    static get RSS_FEED_URL_COLLECTION_NAME() {
        return 'rss-feed-url';
    }

    /**
     * @returns {Object}
     */
    static getInstance() {
        if (CsvFileLoader.instance === null) {
            CsvFileLoader.instance = new CsvFileLoader(
                MongoDbRepository.getInstance()
            );
        }
        return CsvFileLoader.instance;
    }

    /**
     * @param {MongoDbRepository} mongo_db_repository
     */
    constructor(mongo_db_repository) {
        this.mongo_db_repository = mongo_db_repository;
    }

    /**
     * @param {*} csv_file
     * @param {*} csv_row_callback
     * @returns {Promise<void>}
     */
    readLinePerLineCsvFile(csv_file, csv_row_callback) {
        return new Promise((resolve, reject) => fs
            .createReadStream(csv_file)
            .on('error', (error) => reject(error))
            .pipe(csv())
            .on('data', (data) => csv_row_callback(data))
            .on('error', (error) => reject(error))
            .on('end', () => resolve())
        );
    }


    /**
     * @param {String} source_file
     * @returns {Promise}
     */
    loadCsvFileUrlToDatabase(source_file) {

        const website_url_to_insert = [];
        let website_url_to_insert_count = 0;

        return this.mongo_db_repository
            .createCollectionIfNotExists(CsvFileLoader.RSS_FEED_URL_COLLECTION_NAME)
            .then(() => this.readLinePerLineCsvFile(source_file, (data) => {
                website_url_to_insert.push(data);
                website_url_to_insert_count += 1;
            }))
            .then(() => {
                logger.log('Start inserting');
                return Promise.mapSeries(
                    website_url_to_insert,
                    (data) => {
                        logger.log(`Remaining documents to insert: ${website_url_to_insert_count}`);
                        website_url_to_insert_count--;
                        return this.mongo_db_repository
                            .findDocument(CsvFileLoader.RSS_FEED_URL_COLLECTION_NAME, {
                                website_url: data.website_url,
                            })
                            .then((found_document) => {
                                if (found_document === null) {
                                    return this.mongo_db_repository
                                        .insertDocument(CsvFileLoader.RSS_FEED_URL_COLLECTION_NAME,
                                            {
                                                id: Number(data.id),
                                                last_check_date: null,
                                                rss_available: null,
                                                rss_feed_url: `${data.website_url}/feed`.replace('//feed', '/feed'),
                                                website_url: data.website_url,
                                            }
                                        )
                                        .catch(logger.log);
                                }
                                return null;
                            });
                    }
                );
            })
            .then(() => this.mongo_db_repository.closeConnection());
    }
}

CsvFileLoader.instance = null;

module.exports = {
    CsvFileLoader,
};
