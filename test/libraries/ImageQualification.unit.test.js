'use strict';

const {
    ImageQualification,
} = require('../src/librairies');
const axios = require('axios');
const {
    mock,
} = require('sinon');
const {
    expect,
} = require('chai');

describe('ImageQualification unit tests', () => {
    const mocks = {};
    let image_qualification = null;

    before((done) => {
        image_qualification = ImageQualification.getInstance();
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

        mocks.axios.expects('head')
            .withArgs(image_url,
                {
                    timeout: 1,
                }
            )
            .returns({

            });
        
            
        
        done();


    });
});
