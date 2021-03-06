/* eslint-disable sort-keys */

'use strict';

const {
    expect,
} = require('chai');

const {
    mock,
} = require('sinon');

const moment = require('moment');

const {
    RssFeedItemService,
} = require('../../src/services');

const {
    RssFeedItemRepository,
} = require('../../src/repositories');

const rss_feed_item_object_seed = {
    _id: '5fe80ed763126431a277cc72',
    creator: 'sd',
    title: 'Un détergent désinfectant concentré labellisé par ECOCERT !',
    link: 'http://www.hygiene-et-nature.com/un-desinfectant-concentre-ecocert/',
    pubDate: new Date('2020-04-16T09:23:32.000Z'),
    'content:encoded': '<p><img class="alignleft wp-image-142143 size-thumbnail" src="http://www.hygiene-et-nature.com/wp-content/uploads/2019/12/logo_ecocert-150x150.jpg" alt="logo_ecocert" width="150" height="150" />Nouveau à notre gamme !</p>\n<p>DYACIL AV CONCENTRE est un Détergent Désinfectant Concentré, apte au contact alimentaire.</p>\n<p>Certifié par Ecocert, il est formulé sans ammonium quaternaire et avec 99,4% du total des ingrédients sont d’origine végétale et/ou minérale.</p>\n<p><span id="more-144301"></span></p>\n<p style="text-align: left;">Particulièrement recommandé en cuisines collectives et en industrie agro-alimentaires, il peut s&rsquo;utiliser :<a href="/?p=144249" target="_blank"><img class="alignnone size-thumbnail wp-image-144250 alignright" src="http://www.hygiene-et-nature.com/wp-content/uploads/systalium/images_produits/VI_DYACIL AV_CONCENTRE _5L.jpg" alt="VI_DYACIL AV_CONCENTRE _5L.jpg" width="1" height="1" /></a></p>\n<ul>\n<li style="text-align: left;">en centrale de désinfection,</li>\n<li>en centrale mousse sous pression,</li>\n<li>en canon à mousse,</li>\n<li>en application manuelle,</li>\n<li>par pulvérisation</li>\n<li>en trempage</li>\n</ul>\n<p>Fiche technique et FDS disponibles <strong><a href="/?p=144249">ici</a></strong></p>\n<p>&nbsp;</p>\n<p>Cet article <a rel="nofollow" href="http://www.hygiene-et-nature.com/un-desinfectant-concentre-ecocert/">Un détergent désinfectant concentré labellisé par ECOCERT !</a> est apparu en premier sur <a rel="nofollow" href="http://www.hygiene-et-nature.com">Hygiène et Nature</a>.</p>\n',
    'content:encodedSnippet': 'Nouveau à notre gamme !\nDYACIL AV CONCENTRE est un Détergent Désinfectant Concentré, apte au contact alimentaire.\nCertifié par Ecocert, il est formulé sans ammonium quaternaire et avec 99,4% du total des ingrédients sont d’origine végétale et/ou minérale.\n\nParticulièrement recommandé en cuisines collectives et en industrie agro-alimentaires, il peut s’utiliser :\nen centrale de désinfection,\nen centrale mousse sous pression,\nen canon à mousse,\nen application manuelle,\npar pulvérisation\nen trempage\nFiche technique et FDS disponibles ici\n \nCet article Un détergent désinfectant concentré labellisé par ECOCERT ! est apparu en premier sur Hygiène et Nature.',
    'dc:creator': 'sd',
    comments: 'http://www.hygiene-et-nature.com/un-desinfectant-concentre-ecocert/#comments',
    content: '<p>Nouveau à notre gamme ! DYACIL AV CONCENTRE est un Détergent Désinfectant Concentré, apte au contact alimentaire. Certifié par Ecocert, il est formulé sans ammonium quaternaire et avec 99,4% du total des ingrédients sont d’origine végétale et/ou minérale. Particulièrement recommandé en cuisines collectives et en industrie agro-alimentaires, il peut s&#8217;utiliser : en centrale de désinfection, en [&#8230;]</p>\n<p>Cet article <a rel="nofollow" href="http://www.hygiene-et-nature.com/un-desinfectant-concentre-ecocert/">Un détergent désinfectant concentré labellisé par ECOCERT !</a> est apparu en premier sur <a rel="nofollow" href="http://www.hygiene-et-nature.com">Hygiène et Nature</a>.</p>\n',
    contentSnippet: 'Nouveau à notre gamme ! DYACIL AV CONCENTRE est un Détergent Désinfectant Concentré, apte au contact alimentaire. Certifié par Ecocert, il est formulé sans ammonium quaternaire et avec 99,4% du total des ingrédients sont d’origine végétale et/ou minérale. Particulièrement recommandé en cuisines collectives et en industrie agro-alimentaires, il peut s’utiliser : en centrale de désinfection, en […]\nCet article Un détergent désinfectant concentré labellisé par ECOCERT ! est apparu en premier sur Hygiène et Nature.',
    guid: 'http://www.hygiene-et-nature.com/?p=144301',
    categories: [
        'Actus',
    ],
    isoDate: '2020-04-16T09:23:32.000Z',
    rss_feed_url_id: 78,
};

describe('RssFeedItemService Formatters / Normalizers', () => {

    it('Should be able to normalize search result', (done) => {
        const result = RssFeedItemService
            .getInstance()
            .formatRssItem(rss_feed_item_object_seed);
        expect(result).to.deep.equal(
            {
                id: '5fe80ed763126431a277cc72',
                image_url_list: [],
                image_url: null,
                categories: [
                    'Actus',
                ],
                link: 'http://www.hygiene-et-nature.com/un-desinfectant-concentre-ecocert/',
                publication_date: '2020-04-16T09:23:32.000Z',
                rss_feed_url_id: 78,
                summary: 'Nouveau à notre gamme ! DYACIL AV CONCENTRE est un Détergent Désinfectant Concentré, apte au contact alimentaire. Certifié par Ecocert, il est formulé sans ammonium quaternaire et avec 99,4% du total des ingrédients sont d’origine végétale et/ou minérale. Particulièrement recommandé en cuisines collectives et en industrie agro-alimentaires, il peut s’utiliser : en centrale de désinfection, en […]\n'
                    + 'Cet article Un détergent désinfectant concentré labellisé par ECOCERT ! est apparu en premier sur Hygiène et Nature.',
                title: 'Un détergent désinfectant concentré labellisé par ECOCERT !',
                tags_list: [],
                item_count: null,
            }
        );

        done();
    });

    it('Should be able to extract url image', (done) => {
        const result = RssFeedItemService
            .getInstance()
            .extractImgUrlsFromHtml(rss_feed_item_object_seed['content:encoded']);
        expect(result).to.deep.equal([
            'http://www.hygiene-et-nature.com/wp-content/uploads/2019/12/logo_ecocert-150x150.jpg',
            'http://www.hygiene-et-nature.com/wp-content/uploads/systalium/images_produits/VI_DYACIL AV_CONCENTRE _5L.jpg',
        ]);

        done();
    });

    it('Should be able to extract url images form strange declarations', (done) => {
        const img_string = 'bla bla <img src="http://something.com/totourl.png" /> <br /> <img param="something" src="http://something.com/totourl_1.png" /><img param="something" src="http://something.com/totourl_2.png" blabla=somethingelse />Something fun here <img src="http://something.com/totourl_3.png" >';
        const result = RssFeedItemService
            .getInstance()
            .extractImgUrlsFromHtml(img_string);

        expect(result).to.deep.equal([
            'http://something.com/totourl.png',
            'http://something.com/totourl_1.png',
            'http://something.com/totourl_2.png',
            'http://something.com/totourl_3.png',
        ]);
        done();
    });

    it('Should be able to extract url images form strange declarations', (done) => {
        expect(
            RssFeedItemService
                .getInstance()
                .formatDailyAggregatedResponse({
                    first: {
                        a: 1,
                    },
                })
        ).to.deep.equal({
            a: 1,
            item_count: null,
        });
        expect(
            RssFeedItemService
                .getInstance()
                .formatDailyAggregatedResponse({
                    first: {
                        a: 1,
                    },
                    item_count: 15,
                })
        ).to.deep.equal({
            a: 1,
            item_count: 15,
        });
        done();
    });

});

describe('RssFeedItemService Aggregation', () => {

    it('Should be able to search aggregated results', (done) => {
        const params = {
            publication_end_date: new Date('2020-12-14'),
            publication_start_date: new Date('2020-12-15'),
        };
        RssFeedItemService
            .getInstance()
            .searchDailyAggregated(params)
            .then(() => {
                // console.log(data);
                done();
            });
    });
});


describe('normalizedSearch unit test', () => {
    const mocks = {};

    before((done) => {
        const rss_feed_item_service = RssFeedItemService.getInstance();
        const rss_feed_item_repository = RssFeedItemRepository.getInstance();
        mocks.rss_feed_item_service = mock(rss_feed_item_service);
        mocks.rss_feed_item_repository = mock(rss_feed_item_repository);
        done();
    });

    after((done) => {
        mocks.rss_feed_item_service.restore();
        mocks.rss_feed_item_repository.restore();
        done();
    });

    describe('Testing submethod selection switch', () => {
        it('case searchDailyAggregated', (done) => {
            const input = {
                company_id_list: [1],
                daily_aggregation: true,
                limit: 10,
                offset: 0,
                publication_end_date: moment().toISOString(),
                publication_start_date: moment().toISOString(),
            };

            mocks.rss_feed_item_service
                .expects('searchDailyAggregated')
                .once()
                .withArgs({
                    company_id_list: input.company_id_list,
                    limit: input.limit,
                    offset: input.offset,
                    publication_end_date: input.publication_end_date,
                    publication_start_date: input.publication_start_date,
                    is_visible: true,
                    language_list: ['french'],
                })
                .returns(Promise.resolve([]));

            RssFeedItemService
                .getInstance()
                .normalizedSearch(input)
                .then(() => {
                    try {
                        mocks.rss_feed_item_service.verify();
                    } catch (error) {
                        done(error);
                    }
                    done();
                })
                .catch(done);

        });
    });

    describe('Simple search', () => {
        it('Should be able to search', (done) => {
            mocks.rss_feed_item_repository.expects('search')
                .once()
                .returns(Promise.resolve('test'));

            RssFeedItemService
                .getInstance()
                .search()
                .then(() => {
                    mocks.rss_feed_item_repository.verify();
                    done();
                })
                .catch(done);
        });
    });
});
