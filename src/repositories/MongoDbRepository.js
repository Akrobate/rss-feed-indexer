'use strict';

const {
    MongoClient,
    ObjectID,
} = require('mongodb');

const {
    configuration,
} = require('../configuration');

const {
    logger,
} = require('../logger');

class MongoDbRepository {

    /**
     * connection pattern
     * 'mongodb://'+DATABASEUSERNAME+':'+DATABASEPASSWORD+'@'+DATABASEHOST+':'DATABASEPORT+'/
     *
     * @static
     * @returns {String}
     */
    static get CONNECTION_CREDENTIAL() {

        const {
            username,
            password,
            host,
            port,
            database_name,
        } = configuration.storage.mongodb;

        const DATABASE_HOST = host;
        const DATABASE_PORT = port;
        const DATABASE_USERNAME = username;
        const DATABASE_PASSWORD = password;

        return `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${database_name}?authSource=admin`;
    }

    /**
     * @returns {String}
     */
    static get DATABASE_NAME() {
        const {
            database_name,
        } = configuration.storage.mongodb;
        return database_name;
    }

    /* istanbul ignore next */
    /**
     * @static
     * @returns {MongoDbRepository}
     */
    static getInstance() {
        if (MongoDbRepository.instance === null) {
            MongoDbRepository.instance = new MongoDbRepository(
                MongoClient
            );
        }
        return MongoDbRepository.instance;
    }


    /**
     * @param {MongoClient} mongodb_client
     */
    constructor(
        mongodb_client
    ) {
        this.mongodb_client = mongodb_client;
        this.mongodb_connection_handler = null;
        this.mongodb_connection_database_handler = {};
    }


    /**
     * Connection handler
     *
     * @returns {Promise<Object|error>}
     */
    getConnection() {
        return new Promise((resolve, reject) => {
            if (this.mongodb_connection_handler === null) {
                return MongoClient
                    .connect(MongoDbRepository.CONNECTION_CREDENTIAL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    })
                    .then((connection) => {
                        this.mongodb_connection_handler = connection;
                        logger.info('Connection to mongodb: Success');
                        return resolve(this.mongodb_connection_handler);
                    })
                    .catch(reject);
            }
            return resolve(this.mongodb_connection_handler);
        });
    }

    /**
     * Close the connection to mongodb
     * Must be called, if not script will not exit
     *
     * @returns {Promse<Object|error>}
     */
    closeConnection() {
        return new Promise((resolve) => this
            .mongodb_connection_handler
            .close()
            .then((result) => {
                this.cleanConnectionDatabaseHandler();
                this.mongodb_connection_handler = null;
                return resolve(result);
            })
        );
    }


    /**
     * Selects the database to use
     *
     * @param {String} database_name
     * @returns {Object}
     */
    useDataBase(database_name) {
        if (this.mongodb_connection_database_handler[database_name] === undefined) {
            this.mongodb_connection_database_handler[database_name] = this
                .mongodb_connection_handler
                .db(database_name);
        }
        return this.mongodb_connection_database_handler[database_name];
    }

    /**
     * @returns {void}
     */
    cleanConnectionDatabaseHandler() {
        Object.keys(this.mongodb_connection_database_handler).forEach((key) => {
            delete this.mongodb_connection_database_handler[key];
        });
    }

    /**
     * Creates a new collection if not exists in database
     *
     * @param {String} collection_name
     * @returns {Promise<Object|error>}
     */
    createCollectionIfNotExists(collection_name) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo.collections())
            .then((collection_list) => {
                if (!collection_list.map((colection) => colection.s.namespace.collection)
                    .includes(collection_name)) {
                    return this.createCollection(collection_name);
                }
                return true;
            });
    }

    /**
     * Creates a new collection if not exists in database
     *
     * @param {String} collection_name
     * @returns {Promise<Object|error>}
     */
    listAllCollections() {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo.collections());
    }

    /**
     * Create a collection on default database with collection_name
     *
     * @param {String} collection_name
     * @returns {Promise<Object|error>}
     */
    createCollection(collection_name) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo.createCollection(collection_name));
    }

    /**
     * Create a collection on default database with collection_name
     *
     * @param {String} collection_name
     * @returns {Promise<Object|error>}
     */
    dropCollection(collection_name) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo.collection(collection_name).drop());
    }

    /**
     * Drop database
     *
     * @param {String} database_name
     * @returns {Promise<Object|error>}
     */
    dropDatabase(database_name) {
        return this
            .getConnection()
            .then(() => this.useDataBase(database_name))
            .then((dbo) => dbo.dropDatabase());
    }

    /**
     * Insert multiple documents
     *
     * @param {String} collection_name
     * @param {String} document_list
     * @returns {Promise<Object|error>}
     */
    insertDocumentList(collection_name, document_list) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .insertMany(document_list)
            );
    }

    /**
     * Insert single document
     *
     * @param {String} collection_name
     * @param {String} document
     * @returns {Promise<Object|error>}
     */
    insertDocument(collection_name, document) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .insertOne(document)
            );
    }

    /**
     * Returns found document
     *
     * @param {String} collection_name
     * @param {Object} query
     * @param {Object} fields_selection
     * @returns {Promise<Object|error>}
     */
    findDocument(collection_name, query) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .findOne(query)
            );
    }

    /**
     * Returns a list of found documents
     *
     * @param {String} collection_name
     * @param {Object} query
     * @param {Number} limit
     * @param {Number} offset
     * @param {Object} fields_selection
     * @param {Object} sort
     * @returns {Promise<Object|error>}
     */
    findDocumentList(collection_name, query, limit, offset, fields_selection, sort) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .find(query, fields_selection)
                .sort(sort)
                .skip(offset === undefined ? 0 : offset)
                .limit(limit === undefined ? 0 : limit)
                .toArray()
            );
    }

    /**
     * Returns a list of found documents
     *
     * @param {String} collection_name
     * @param {Object} query
     * @returns {Promise<Object|error>}
     */
    countDocuments(collection_name, query) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .find(query)
                .count()
            );
    }

    /**
     * Returns a list of found documents
     *
     * @param {String} collection_name
     * @param {Object} query
     * @param {Object} document
     * @returns {Promise<Object|error>}
     */
    updateDocument(collection_name, query, document) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .updateOne(
                    query,
                    {
                        $set: document,
                    }
                )
            );
    }

    /**
     * Updates all found documents
     *
     * @param {String} collection_name
     * @param {Object} query
     * @param {Object} document
     * @returns {Promise<Object|error>}
     */
    updateDocuments(collection_name, query, document) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .updateMany(
                    query,
                    {
                        $set: document,
                    }
                )
            );
    }

    /**
     * Returns a list of found documents
     *
     * @param {String} collection_name
     * @param {Object} aggregation
     * @returns {Promise<Object|error>}
     */
    aggregate(collection_name, aggregation) {
        return this
            .getConnection()
            .then(() => this.useDataBase(MongoDbRepository.DATABASE_NAME))
            .then((dbo) => dbo
                .collection(collection_name)
                .aggregate(
                    aggregation,
                    {
                        allowDiskUse: true,
                    }
                )
                .toArray()
            );
    }

    /**
     * @returns {ObjectId}
     */
    buildNewObjectId() {
        return new ObjectID();
    }

    /**
     * @param {String} object_id_string
     * @returns {ObjectId}
     */
    builObjectIdFromString(object_id_string) {
        return new ObjectID(object_id_string);
    }

}

MongoDbRepository.instance = null;

module.exports = {
    MongoDbRepository,
};


