const { Router } = require('express');
const { check } = require('express-validator');


const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');

const { existProductID, existCategoryID } = require('../utils');

const { validateFields } = require('../middlewares');


const router = Router();

// Obtener todos los productos - publico
router.get('/', getProducts);


// Obtener producto por id - publico
router.get('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existProductID),
    validateFields,
], getProduct);


// Crear producto - privado - Cualquier persona con un token válido 
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('category', 'It is not a mongo ID').isMongoId(),
    check('category').custom(existCategoryID),
    validateFields,
], createProduct);

// Actualizar - privado - Cualquiera con un token válido
router.put('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existProductID),
    validateFields,
], updateProduct);


// Borrar producto - Rol: Admin
router.delete('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existProductID),
    validateFields,
], deleteProduct);

module.exports = router