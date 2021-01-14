'use strict';

const LanguageDetect = require('languagedetect');

class LanguageDetector {

    /**
     * @returns {LanguageDetector}
     */
    static getInstance() {
        if (LanguageDetector.instance === null) {
            LanguageDetector.instance = new LanguageDetector();
        }
        return LanguageDetector.instance;
    }

    /**
     */
    constructor() {
        this.language_detect = new LanguageDetect();
    }

    /**
     * @param {Obejct} rss_item
     * @returns {Obejct}
     */
    detectFromRssContentSnippet(rss_item) {
        const {
            contentSnippet,
        } = rss_item;
        return this.detectLanguageApplyingScoreThreshold(contentSnippet);
    }

    /**
     * @param {String} text
     * @returns {String}
     */
    detectLanguageApplyingScoreThreshold(text) {
        const detection_object = this.detectLangaguage(text);
        const detection_object_with_threshold = this.applyScoreThreshold(detection_object);
        if (detection_object_with_threshold) {
            return detection_object_with_threshold.language;
        }
        return null;
    }

    /**
     * @param {*} text
     * @returns {Object}
     */
    detectLangaguage(text) {
        const LIMIT_RESULTS = 1;
        const lang_result_detection = this.language_detect
            .detect(text, LIMIT_RESULTS);
        let lang_result = null;
        let score = null;
        const [best_result] = lang_result_detection;
        if (best_result) {
            [lang_result, score] = best_result;
            return {
                language: lang_result,
                score,
            };
        }
        return null;
    }

    /**
     * @param {OObject} detection
     * @returns {String}
     */
    applyScoreThreshold(detection) {
        const SCORE_THRESHOLD = 0.0;
        if (detection) {
            if (Number(detection.score) > SCORE_THRESHOLD) {
                return detection;
            }
        }
        return null;
    }
}

LanguageDetector.instance = null;

module.exports = {
    LanguageDetector,
};
