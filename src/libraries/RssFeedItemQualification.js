'use strict';

const {
    ImagesQualification,
} = require('./ImagesQualification');

const {
    LanguageDetector,
} = require('./LanguageDetector');

const {
    TagsQualification,
} = require('./TagsQualification');

class RssFeedItemQualification {

    /**
     * @returns {RssFeedItemQualification}
     */
    static getInstance() {
        if (RssFeedItemQualification.instance === null) {
            RssFeedItemQualification.instance = new RssFeedItemQualification(
                ImagesQualification.getInstance(),
                LanguageDetector.getInstance(),
                TagsQualification.getInstance()
            );
        }
        return RssFeedItemQualification.instance;
    }

    /**
     * @param {RssFeedItemQualification} images_qualification
     * @param {LanguageDetector} language_detector
     * @param {TagsQualification} tags_qualification
     */
    constructor(images_qualification, language_detector, tags_qualification) {
        this.images_qualification = images_qualification;
        this.language_detector = language_detector;
        this.tags_qualification = tags_qualification;

        this.TITLE_SIZE_THRESHOLD = 4;

        language_detector.setScoreThreshold(0.08);
        images_qualification.setSizeThreshold(10000);
    }

    /**
     * @param {*} item
     * @returns {Object}
     */
    qualifyFeedItem(item) {
        return new Promise((resolve, reject) => {
            const result_item = Object.assign({}, item);
            try {
                result_item.language = this.language_detector
                    .detectLanguageApplyingScoreThreshold(item.contentSnippet);

                result_item.tags_list = this.tags_qualification
                    .generateTagsFromCategoriesList(item.categories);

                result_item.image_url_list = this.images_qualification
                    .extractImgUrlsFromHtml(item['content:encoded']);

                result_item.image_url = null;
                return this.images_qualification.findBestImage(result_item.image_url_list)
                    .then((best_image) => {
                        result_item.image_url = best_image;
                    })
                    .then(() => {
                        result_item.is_visible = this.isVisibleFeedItem(result_item);
                    })
                    .then(() => resolve(result_item))
                    .catch(reject);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * @param {Object} qualified_item
     * @returns {Boolean}
     */
    isVisibleFeedItem(qualified_item) {
        let title_is_setted = false;
        if (qualified_item.title && qualified_item.title.length > this.TITLE_SIZE_THRESHOLD) {
            title_is_setted = true;
        }
        return title_is_setted;
    }

}

RssFeedItemQualification.instance = null;

module.exports = {
    RssFeedItemQualification,
};
