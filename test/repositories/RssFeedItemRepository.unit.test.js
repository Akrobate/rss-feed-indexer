'use strict';

const {
    RssFeedItemRepository,
} = require('../../src/repositories');

const {
    expect,
} = require('chai');

describe('RssFeedItemRepository', () => {

    it.only('searchDailyAggregated', (done) => {
        const params = {
            limit: null,
            offset: null,
            publication_end_date: new Date('2020-11-30'),
            publication_start_date: new Date('2020-12-15'),
        };
        console.log(params);
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        rss_feed_item_repository.searchDailyAggregated(params)
            .then((data) => {
                console.log('Here...');
                // console.log(data);
                data.map((i) => console.log(i._id.date + ' ' + i.item_count));
                data.map((i) => console.log(i));

                console.log(data.length);
            })
            .catch(console.log)
            .finally(() => rss_feed_item_repository.closeConnection());

        done();
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

    });
});
