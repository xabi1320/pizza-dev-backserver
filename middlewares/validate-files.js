const { request, response } = require("express");

const validateUploadFiles = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img) {
        res.status(400).send({ msg: 'There are no files to upload' });
        return;
    }

    next();
}

module.exports = {
    validateUploadFiles,
}