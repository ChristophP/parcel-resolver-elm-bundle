const {Resolver} = require('@parcel/plugin');
const resolve = require('./resolve');

module.exports = new Resolver({ resolve });

