const { Router } = require('express');
const { check } = require('express-validator');


const { getIngredients, getIngredient, createIngredient, updateIngredient, deleteIngredient } = require('../controllers/ingredients');

const { existIngredientID, existCategoryID } = require('../utils');

const { validateFields } = require('../middlewares');


const router = Router();

// Obtener todos los productos - publico
router.get('/', getIngredients);


// Obtener producto por id - publico
router.get('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existIngredientID),
    validateFields,
], getIngredient);


// Crear producto - privado - Cualquier persona con un token válido 
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('category', 'It is not a mongo ID').isMongoId(),
    check('category').custom(existCategoryID),
    validateFields,
], createIngredient);

// Actualizar - privado - Cualquiera con un token válido
router.put('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existIngredientID),
    validateFields,
], updateIngredient);


// Borrar producto - Rol: Admin
router.delete('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existIngredientID),
    validateFields,
], deleteIngredient);

module.exports = router