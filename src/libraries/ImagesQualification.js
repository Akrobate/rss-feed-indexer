'use strict';

const Promise = require('bluebird');
const axios = require('axios');

class ImagesQualification {

    /**
     * @returns {ImagesQualification}
     */
    static getInstance() {
        if (ImagesQualification.instance === null) {
            ImagesQualification.instance = new ImagesQualification();
        }
        return ImagesQualification.instance;
    }

    /**
     * @param {Parser} parser
     */
    constructor(parser) {
        this.parser = parser;

        this.SIZE_THRESHOLD = 10000;
    }

    /**
     * @param {Number} size
     * @returns {void}
     */
    setSizeThreshold(size) {
        this.SIZE_THRESHOLD = size;
    }

    /**
     * @param {Array} image_url_list
     * @returns {String}
     */
    findBestImage(image_url_list) {
        return this.findImageSizeMetaData(image_url_list)
            .then((data) => this.filterAndSortImagesUrlBySize(data))
            .then(([data]) => {
                if (!data) {
                    return null;
                }
                if (data.size < this.SIZE_THRESHOLD) {
                    return null;
                }
                return data.url;
            });
    }


    /**
     * @param {*} image_url_list
     * @returns {Array}
     */
    filterAndSortImagesUrlBySize(image_url_list) {
        const filtered_list = image_url_list.filter((item) => item.size !== null);
        return filtered_list.sort((item1, item2) => item2.size - item1.size);
    }


    /**
     * @param {*} image_url_list
     * @returns {Array<Object>}
     */
    findImageSizeMetaData(image_url_list) {
        console.log(image_url_list);
        return Promise.mapSeries(image_url_list, (image_url) => axios
            .head(image_url)
            .then((headers_data) => ({
                size: Number(headers_data.headers['content-length']),
                url: image_url,
            }))
            .catch(() => ({
                size: null,
                url: image_url,
            }))
        );
    }

    /**
     * @param {string} html_string
     * @returns {Array<string>}
     */
    extractImgUrlsFromHtml(html_string) {
        let detection = null;
        const urls = [];
        const rex = /<img[^>]+src="?([^"]+)"?\s[^>]*>/g;

        // eslint-disable-next-line no-cond-assign
        while (detection = rex.exec(html_string)) {
            urls.push(detection[1]);
        }
        return urls;
    }

}

ImagesQualification.instance = null;

module.exports = {
    ImagesQualification,
};
