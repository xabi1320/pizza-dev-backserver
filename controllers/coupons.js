const { request, response } = require('express');

const { Coupon } = require('../models');


// Obtener Cupones - paginado - total - populate
const getCoupons = async(req = request, res = response) => {
    try {
        const { since = 0, limit = 5 } = req.query;
        const query = { status: true };

        const [total, coupons] = await Promise.all([
            Coupon.countDocuments(query),
            Coupon.find(query),
        ]);

        res.status(200).json({
            ok: true,
            total,
            coupons
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Obtener cupon -populate{}
const getCoupon = async(req = request, res = response) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findById(id);

        res.status(200).json({
            ok: true,
            coupon
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Crear cupon
const createCoupon = async(req = request, res = response) => {
    try {
        const { img } = req.files ? req.files : req.body;
        const data = req.body;
        const description = data.description.toUpperCase();
        const couponDB = await Coupon.findOne({ description });

        if (couponDB) {
            return res.status(400).json({
                ok: false,
                msg: `Coupon '${couponDB.description}', already exist`
            });
        }

        // Generar la data a guardar
        data.description = description
        data.img = img ? await uploadFile(req) : '';

        const coupon = new Coupon(data);
        // Guaardar en DB
        await coupon.save();

        res.status(201).json({
            ok: true,
            coupon
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}

// Actualizar cupon
const updateCoupon = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, status, ...data } = req.body
        const description = data.description && data.description.toUpperCase();
        data.description = data.description && description;
        if (req.files) data.img = await uploadFile(req, undefined, true);

        const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            coupon,
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


// Borrar cupon - estado:false
const deleteCoupon = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            ok: true,
            coupon,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


module.exports = {
    createCoupon,
    deleteCoupon,
    getCoupon,
    getCoupons,
    updateCoupon,
}