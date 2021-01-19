'use strict';

class TagsQualification {


    /**
     * @returns {TagsQualification}
     */
    static getInstance() {
        if (TagsQualification.instance === null) {
            TagsQualification.instance = new TagsQualification();
        }
        return TagsQualification.instance;
    }

    /**
     * @param {TagsQualification} images_qualification
     * @param {LanguageDetector} language_detector
     */
    constructor() {
        this.categories_stop_words = ['non classé', 'articles', 'uncategorized'];
    }

    /**
     * @param {Array} categories_list
     * @returns {Array}
     */
    generateTagsFromCategoriesList(categories_list) {
        if (categories_list) {
            let result_list = categories_list.map((category) => category.toLowerCase());
            result_list = [...new Set(result_list)];
            result_list = result_list
                .filter((category) => this.categories_stop_words.indexOf(category) === -1);
            result_list = result_list.filter((category) => category.indexOf(':') === -1);
            result_list = result_list.slice(0, 3);
            return result_list;
        }
        return [];
    }

}

TagsQualification.instance = null;

module.exports = {
    TagsQualification,
};


