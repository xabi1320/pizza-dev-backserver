const dbValidators = require('./db-validators');
// const generarJWT = require('./generar-jwt');
// const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');
const orbderValidators = require('./order-validators');


module.exports = {
    ...dbValidators,
    // ...generarJWT,
    // ...googleVerify,
    ...uploadFile,
    ...orbderValidators,
}