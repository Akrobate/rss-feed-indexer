'use strict';

const {
    ImagesQualification,
} = require('../../src/libraries');
const axios = require('axios');
const {
    mock,
} = require('sinon');
const {
    expect,
} = require('chai');

describe('ImagesQualification unit tests', () => {
    const mocks = {};
    let image_qualification = null;

    before((done) => {
        image_qualification = ImagesQualification.getInstance();
        mocks.axios = mock(axios);
        done();
    });

    after((done) => {
        image_qualification = null;
        mocks.axios.restore();
        done();
    });


    it('Should be ablse to extract multiplce extractImgUrlsFromHtml', (done) => {
        image_qualification.setSizeThreshold(1000);
        image_qualification.setDetectionTimeout(1);

        const url_list = [
            'http://www.domain.com/url1.jpg',
            'http://www.domain.com/url2.jpg',
            'http://www.domain.com/url3.jpg',
        ];

        mocks.axios.expects('head')
            .once()
            .withArgs(
                url_list[0],
                {
                    timeout: 1,
                }
            )
            .returns(Promise.resolve({
                headers: {
                    'content-length': 500,
                },
            }));

        mocks.axios.expects('head')
            .once()
            .withArgs(
                url_list[1],
                {
                    timeout: 1,
                }
            )
            .returns(Promise.resolve({
                headers: {
                    'content-length': 2000,
                },
            }));
        mocks.axios.expects('head')
            .once()
            .withArgs(
                url_list[2],
                {
                    timeout: 1,
                }
            )
            .returns(Promise.resolve({
                headers: {
                    'content-length': 3000,
                },
            }));

        image_qualification
            .findBestImage(url_list)
            .then((data) => {
                mocks.axios.verify();
                expect(data).to.equal(url_list[2]);
                done();
            })
            .catch(done);

    });
});
