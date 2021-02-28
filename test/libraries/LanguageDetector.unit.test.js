'use strict';

const {
    LanguageDetector,
} = require('../../src/libraries');
const {
    mock,
} = require('sinon');
const {
    expect,
} = require('chai');

describe('LanguageDetection unit tests', () => {
    const mocks = {};
    let language_detector = null;

    beforeEach((done) => {
        language_detector = LanguageDetector.getInstance();
        mocks.language_detect = mock(language_detector.language_detect);
        done();
    });

    afterEach((done) => {
        language_detector = null;
        mocks.language_detect.restore();
        done();
    });

    describe('Non detected language', () => {
        it('No language found should return null', (done) => {
            const text = 'Some text';
            mocks.language_detect.expects('detect')
                .once()
                .withArgs(text, 1)
                .returns([null]);
            expect(
                language_detector.detectFromRssContentSnippet({
                    contentSnippet: text,
                })
            ).to.equal(null);
            mocks.language_detect.verify();
            done();
        });
    });

    describe('applyScoreThreshold', () => {
        it('Should return null if score is to low', (done) => {
            language_detector.setScoreThreshold(0.08);
            expect(
                language_detector.applyScoreThreshold({
                    score: 0.01,
                })
            ).to.equal(null);
            done();
        });
        it('Should return null if detection is undefined', (done) => {
            expect(
                language_detector.applyScoreThreshold(undefined)
            ).to.equal(null);
            done();
        });
    });
});
