const { Router } = require('express');
const { check } = require('express-validator');

const { getOrders, getOrder, createOrder, updateOrder } = require('../controllers/orders');

const { existOrderID } = require('../utils');

const { validateFields } = require('../middlewares');


const router = Router();

// Obtener todos las ordenes - publico
router.get('/', getOrders);


// Obtener ordenes por id - publico
router.get('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existOrderID),
    validateFields,
], getOrder);


// Crear cupon - privado - Cualquier persona con un token válido 
router.post('/', [
    check('customer_data', 'Customer data is required').notEmpty(),
    check('delivery', 'Delivery method is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('total_Amount', 'Total amount is required').notEmpty(),
    validateFields,
], createOrder);

// Actualizar - privado - Cualquiera con un token válido
router.put('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existOrderID),
    validateFields,
], updateOrder);


// Borrar cupon - Rol: Admin
// router.delete('/:id', [
//     check('id', 'It is not a mongo ID').isMongoId(),
//     check('id').custom(existOrderID),
//     validateFields,
// ], deleteCoupon);

module.exports = router