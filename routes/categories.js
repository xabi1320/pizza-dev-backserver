const { Router } = require('express');
const { check } = require('express-validator');

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const { existCategoryID } = require('../utils');

const { validateFields } = require('../middlewares');


const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories);


// Obtener categoria por id - publico
router.get('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCategoryID),
    validateFields,
], getCategory);


// Crear categoria - privado - Cualquier persona con un token válido 
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    validateFields,
], createCategory);

// Actualizar - privado - Cualquiera con un token válido
router.put('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCategoryID),
    validateFields,
], updateCategory);


// Borrar Categoria - Rol: Admin
router.delete('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCategoryID),
    validateFields,
], deleteCategory);

module.exports = router