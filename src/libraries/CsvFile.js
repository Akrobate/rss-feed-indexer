'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const {
    MongoDbRepository,
} = require('../repositories');
class CsvFile {

    /**
     * @returns {Object}
     */
    static getInstance() {
        if (CsvFile.instance === null) {
            CsvFile.instance = new CsvFile(
                MongoDbRepository.getInstance()
            );
        }
        return CsvFile.instance;
    }

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
     * @returns {Promise}
     */
    loadCsvFileUrlToDatabase() {
        return this.mongodb_repository
            .createCollectionIfNotExists(rss_feed_url_collection_name)
            .then(() => csv_file.readLinePerLineCsvFile(source_file, (data) => {
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
                        return mongodb_repository
                            .findDocument(rss_feed_url_collection_name, {
                                website_url: data.website_url,
                            })
                            .then((found_document) => {
                                if (found_document === null) {
                                    return mongodb_repository
                                        .insertDocument(rss_feed_url_collection_name,
                                            {
                                                id: Number(data.id),
                                                website_url: data.website_url,
                                                rss_feed_url: `${data.website_url}/feed`.replace('//feed', '/feed'),
                                                last_check_date: null,
                                                rss_available: null,
                                            }
                                        )
                                        .catch(logger.log);
                                }
                                return null;
                            });
                    }
                );
            })
            .then(() => mongodb_repository.closeConnection());
    }
}

CsvFile.instance = null;

module.exports = {
    CsvFile,
};
