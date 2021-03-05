'use strict';

const {
    MongoDbRepository,
    RssFeedItemRepository,
} = require('../../src/repositories');
const {
    mock,
} = require('sinon');
const {
    expect,
} = require('chai');

// eslint-disable-next-line func-names
describe('RssFeedItemRepository', function() {

    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);

    it.skip('countDailyAggregated', (done) => {
        const params = {
            limit: null,
            offset: null,
            publication_end_date: new Date('2020-11-30'),
            publication_start_date: new Date('2020-12-15'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.countDailyAggregated(params)
            .then((data) => {
                console.log('Here...');
                // console.log(data);
                data.map((i) => console.log(i.date + ' ' + i.item_count));
                data.map((i) => console.log(i));

                console.log(data.length);
            })
            .catch(done)
            .finally(() => {
                rss_feed_item_repository.closeConnection();
                done();
            });

    });

    it.skip('Document redaction - countDailyAggregated', (done) => {
        const params = {
            limit: null,
            offset: null,
            publication_end_date: new Date('2021-01-04'),
            publication_start_date: new Date('2021-01-18'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.countDailyAggregated(params, true)
            .then((data) => {
                console.log('Here...');
                // console.log(data);
                // data.map((i) => console.log(i.date + ' ' + i.item_count));
                data.map((i) => console.log(i.item_count));
                // data.map((i) => console.log(i));

                console.log(data.length);
            })
            .catch(done)
            .finally(() => {
                rss_feed_item_repository.closeConnection();
                done();
            });

    });

    it.skip('Document redaction - yearly agg count', (done) => {
        const params = {
            limit: null,
            offset: null,
//            publication_end_date: new Date('2020-11-30'),
//            publication_start_date: new Date('2020-12-15'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.countDateAggregated(params, '%Y', false)
            .then((data) => {
                console.log('Aggregation count data');
                // console.log(data);
                data.map((i) => console.log(i.date + ' ' + i.item_count));
                // data.map((i) => console.log(i));

                console.log(data.length);
            })
            .catch(done)
            .finally(() => {
                rss_feed_item_repository.closeConnection();
                done();
            });

    });

    it.skip('Document redaction - 2020 monthly agg count', (done) => {
        const params = {
            limit: null,
            offset: null,
            publication_end_date: new Date('2020-01-01'),
            publication_start_date: new Date('2020-12-31'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.countDateAggregated(params, '%Y-%m', true)
            .then((data) => {
                console.log('Aggregation count data');
                // console.log(data);
                data.map((i) => console.log(i.date + ' ' + i.item_count));
                // data.map((i) => console.log(i));

                console.log(data.length);
            })
            .catch(done)
            .finally(() => {
                rss_feed_item_repository.closeConnection();
                done();
            });
    });

    it.skip('Document redaction - Language count', (done) => {
        const params = {
            limit: null,
            offset: null,
//            publication_end_date: new Date('2020-01-01'),
//            publication_start_date: new Date('2020-12-31'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.countLanguageItems(params)
            .then((data) => {
                console.log('Aggregation count data');
                // console.log(data);
                data.map((i) => console.log(i.language + ' ' + i.item_count));
                // data.map((i) => console.log(i));

                console.log(data.length);
                done();
            })
            .catch(done)
            .finally(() => {
                rss_feed_item_repository.closeConnection();
            });

    });


    describe('Should correctly format search criteria', () => {
        // Api date received '2020-12-31T00:00:00Z'
        it('formating publication_start_date', (done) => {
            const params = {
                publication_start_date: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
            };
            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                pubDate: {
                    $lte: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
                },
            });
            done();
        });

        it('formating publication_end_date', (done) => {
            const params = {
                publication_end_date: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
            };

            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                pubDate: {
                    $gte: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
                },
            });
            done();
        });

        it('formating publication_end_date and publication_start_date', (done) => {
            const params = {
                publication_end_date: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
                publication_start_date: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
            };

            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                pubDate: {
                    $gte: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
                    $lte: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
                },
            });
            done();
        });

        it('formating language_list', (done) => {
            const params = {
                language_list: ['French'],
            };

            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                language: {
                    $in: params.language_list,
                },
            });
            done();
        });
        it('formating company_id_list', (done) => {
            const params = {
                company_id_list: [110, 120],
            };

            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                rss_feed_url_id: {
                    $in: params.company_id_list,
                },
            });
            done();
        });
        it('formating is_visible ', (done) => {
            const params = {
                is_visible: true,
            };
            const rss_feed_item_repository = RssFeedItemRepository.getInstance();
            const result = rss_feed_item_repository.formatSearchCriteria(params);
            expect(result).to.deep.equal({
                is_visible: params.is_visible,
            });
            done();
        });
    });

    describe('Unit testing', () => {

        const mocks = {};
        const mongo_db_repository = MongoDbRepository.getInstance();
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();

        beforeEach((done) => {
            mocks.mongo_db_repository = mock(mongo_db_repository);
            mocks.rss_feed_item_repository = mock(rss_feed_item_repository);
            done();
        });

        afterEach((done) => {
            mocks.mongo_db_repository.restore();
            mocks.rss_feed_item_repository.restore();
            done();
        });

        it('search', (done) => {
            const params = {
                limit: 10,
                offset: 10,
                publication_start_date: new Date('Thu Apr 16 2020 09:23:32 GMT+0000'),
            };
            mocks.mongo_db_repository.expects('findDocumentList')
                .once()
                .withArgs(
                    RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                    {
                        pubDate: {
                            $lte: params.publication_start_date,
                        },
                    },
                    params.limit,
                    params.offset,
                    undefined,
                    {
                        pubDate: -1,
                    }
                )
                .returns(Promise.resolve({}));
            RssFeedItemRepository.getInstance()
                .search(params)
                .then(() => {
                    mocks.mongo_db_repository.verify();
                    done();
                })
                .catch(done);
        });
        it('closeConnection', (done) => {
            mocks.mongo_db_repository.expects('closeConnection')
                .once()
                .returns(Promise.resolve({}));
            RssFeedItemRepository
                .getInstance()
                .closeConnection()
                .then(() => {
                    mocks.mongo_db_repository.verify();
                    done();
                })
                .catch(done);
        });
        it('countDailyAggregated', (done) => {
            mocks.rss_feed_item_repository.expects('countDateAggregated')
                .withArgs(
                    {},
                    '%Y-%m-%d',
                    true
                )
                .once()
                .returns(Promise.resolve({}));
            RssFeedItemRepository.getInstance()
                .countDailyAggregated({}, true)
                .then(() => {
                    mocks.rss_feed_item_repository.verify();
                    done();
                })
                .catch(done);
        });
        it('createIndexForExistanceCheck', (done) => {
            mocks.mongo_db_repository.expects('createIndex')
                .withArgs(
                    RssFeedItemRepository.RSS_FEED_ITEMS_COLLECTION_NAME,
                    {
                        guid: 1,
                        rss_feed_url_id: 1,
                    }
                )
                .once()
                .returns(Promise.resolve({}));
            RssFeedItemRepository.getInstance()
                .createIndexForExistanceCheck()
                .then(() => {
                    mocks.mongo_db_repository.verify();
                    done();
                })
                .catch(done);
        });
    });
});
