'use strict';

const {
    ImagesQualification,
} = require('./libraries/ImagesQualification')

const images_qualification = ImagesQualification.getInstance();

const str = '<p><a href="http://www.hygiene-et-nature.com/wp-content/uploads/2020/01/Bonne-année-2020-HN.jpg"><img class="alignnone wp-image-142374 size-full" src="http://www.hygiene-et-nature.com/wp-content/uploads/2020/01/Bonne-année-2020-HN.jpg" alt="RochersEtFeuilles" width="557" height="401" /></a></p>\n<p>Cet article <a rel="nofollow" href="http://www.hygiene-et-nature.com/bonne-annee-2020/">BONNE ANNEE 2020 !</a> est apparu en premier sur <a rel="nofollow" href="http://www.hygiene-et-nature.com">Hygiène et Nature</a>.</p>\n'


const a = images_qualification.extractImgUrlsFromHtml(str);
console.log(a);

images_qualification.findBestImage(a).then(console.log);

