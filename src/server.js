/* istanbul ignore file */

'use strict';

const {
    app,
} = require('./server-app');
const {
    logger,
} = require('./logger');

app.listen(8090, () => {
    logger.log('Server started');
});
