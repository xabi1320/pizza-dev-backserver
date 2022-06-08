const { Router } = require('express');
const { check } = require('express-validator');

const { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupons');

const { existCouponID } = require('../utils');

const { validateFields } = require('../middlewares');


const router = Router();

// Obtener todos los cupones - publico
router.get('/', getCoupons);


// Obtener cupones por id - publico
router.get('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCouponID),
    validateFields,
], getCoupon);


// Crear cupon - privado - Cualquier persona con un token válido 
router.post('/', [
    check('description', 'Description is required').notEmpty(),
    validateFields,
], createCoupon);

// Actualizar - privado - Cualquiera con un token válido
router.put('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCouponID),
    validateFields,
], updateCoupon);


// Borrar cupon - Rol: Admin
router.delete('/:id', [
    check('id', 'It is not a mongo ID').isMongoId(),
    check('id').custom(existCouponID),
    validateFields,
], deleteCoupon);

module.exports = router