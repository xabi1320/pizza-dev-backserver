const validateFields = require('./validate-fields');
const validateFiles = require('./validate-files');

module.exports = {
    ...validateFields,
    ...validateFiles,
}