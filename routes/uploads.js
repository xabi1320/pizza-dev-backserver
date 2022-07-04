const { Router } = require('express');
const { check, body } = require('express-validator');

const { mostrarImagen, fileUpload, updateImage } = require('../controllers/uploads');

const { allowedCollections } = require('../utils');

const { validateFields, validateUploadFiles } = require('../middlewares');


const router = Router();

router.get('/:id', [
    check('id', 'The ID must be from mongo').isMongoId(),
    body('collecction').custom(c => allowedCollections(c, ['coupons', 'products', 'ingredients'])),
    validateFields
], mostrarImagen);

router.post('/', validateUploadFiles, fileUpload);

router.put('/:id', [
        validateUploadFiles,
        check('id', 'The ID must be from mongo').isMongoId(),
        body('collecction').custom(c => allowedCollections(c, ['coupons', 'products', 'ingredients'])),
        validateFields
    ], updateImage);

module.exports = router