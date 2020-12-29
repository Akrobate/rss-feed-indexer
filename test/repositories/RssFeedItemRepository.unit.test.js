'use strict';

const {
    RssFeedItemRepository,
} = require('../../src/repositories');

const {
    expect,
} = require('chai');

describe('RssFeedItemRepository', () => {

    describe('Should correctly format search criteria', () => {

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

    });
});
