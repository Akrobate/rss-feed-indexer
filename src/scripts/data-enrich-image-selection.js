'use strict';

const Promise = require('bluebird');
const axios = require('axios');

function findImageSizeMetaData(image_url_list) {
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

function filterAndSortImagesUrlBySize(image_url_list) {
    const filtered_list = image_url_list.filter((item) => item.size !== null);
    return filtered_list.sort((item1, item2) => item2.size - item1.size);
}

function findBestImage(image_url_list, size_threshold) {
    return findImageSizeMetaData(image_url_list)
        .then((data) => filterAndSortImagesUrlBySize(data))
        .then(([data]) => {
            if (!data) {
                return null;
            }
            if (data.size < size_threshold) {
                return null;
            }
            return data.url;
        });
}

const image_url_list = [
    'https://app.nomination.fr/assets/images/nomination-logo-white-light.png',
    'https://app.nomidqsdnation.fr/assets/images/nomination-logo-white-light.png',
    'https://www.nomination.fr/wp-content/uploads/2018/02/alarm.svg',
];


findBestImage(image_url_list, 3000)
    .then(console.log);

