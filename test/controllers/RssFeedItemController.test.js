'use strict';

const {
    expect,
} = require('chai');
const {
    mock,
} = require('sinon');
const superTest = require('supertest');
const {
    RssFeedItemService,
} = require('../../src/services');
const {
    RssFeedItemRepository,
} = require('../../src/repositories');
const {
    app,
} = require('../../src/server-app');

const mocks = {};

describe('RssFeedItemController', () => {

    beforeEach(() => {
        mocks.rss_feed_item_service = mock(RssFeedItemService.getInstance());
        mocks.rss_feed_item_repository = mock(RssFeedItemRepository.getInstance());
    });

    afterEach(() => {
        mocks.rss_feed_item_service.restore();
        mocks.rss_feed_item_repository.restore();
    });

    it('Should be able to ping server', (done) => {
        superTest(app)
            .get('/api/ping')
            .expect(200)
            .end((error, response) => {
                if (error) {
                    done(error);
                }
                expect(response.body).to.deep.equal({
                    pong: true,
                });
                done();
            });
    });

    it('Should be able to search', (done) => {

        mocks.rss_feed_item_service
            .expects('search')
            .once()
            .withArgs({
                limit: NaN,
                offset: NaN,
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            })
            .returns(Promise.resolve([]));

        superTest(app)
            .get('/api/rss-feed-items')
            .query({
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            })
            .expect(200)
            .end((error, response) => {
                mocks.rss_feed_item_service.verify();
                if (error) {
                    done(error);
                }
                expect(response.body).to.deep.equal({
                    count: 0,
                    rss_item_list: [],
                });
                done();
            });
    });

    it('Should be able to search normalized', (done) => {

        mocks.rss_feed_item_service
            .expects('normalizedSearch')
            .once()
            .withArgs({
                company_id_list: undefined,
                daily_aggregation: false,
                limit: NaN,
                offset: NaN,
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            })
            .returns(Promise.resolve([]));

        superTest(app)
            .post('/api/rss-feed-items/normalized')
            .send({
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            })
            .expect(200)
            .end((error, response) => {
                mocks.rss_feed_item_service.verify();
                if (error) {
                    done(error);
                }
                expect(response.body).to.deep.equal({
                    count: 0,
                    rss_item_list: [],
                });
                done();
            });
    });

    it('Should be able to count', (done) => {

        mocks.rss_feed_item_repository
            .expects('countDailyAggregated')
            .once()
            .withArgs({
                company_id_list: undefined,
                is_visible: true,
                language_list: ['french'],
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            }, false)
            .returns(Promise.resolve(12));

        superTest(app)
            .post('/api/rss-feed-items/count')
            .send({
                publication_end_date: '2020-12-31T00:00:00Z',
                publication_start_date: '2020-12-31T00:00:00Z',
            })
            // .expect(200)
            .end((error, response) => {

                mocks.rss_feed_item_service.verify();

                if (error) {
                    done(error);
                }
                expect(response.body).to.deep.equal({
                    rss_item_count_list: 12,
                });
                done();
            });
    });
});
