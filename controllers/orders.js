const { request, response } = require('express');

const { Order } = require('../models');


// Obtener Ordenes - paginado - total - populate
const getOrders = async(req = request, res = response) => {

    try {
        const { since = 0, limit = 5 } = req.query;

        const [total, orders] = await Promise.all([
            Order.countDocuments(),
            // Order.find(query).skip(Number(since)).limit(Number(limit)),
            Order.find({}),
        ]);

        res.json({
            ok: true,
            total,
            orders
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Obtener orden -populate{}
const getOrder = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        res.json({
            ok: true,
            order
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Crear orden
const createOrder = async(req = request, res = response) => {

    try {
        const data = req.body;
        const order_number = data.order_number;

        let [orderDB, count] = await Promise.all([
            Order.findOne({ order_number }),
            Order.count(),
        ]);

        count ? data.order_number = count + 1 : data.order_number = 1;

        if (orderDB) {
            return res.status(400).json({
                ok: false,
                msg: `Order '${orderDB.order_number}', already exist`
            });
        }

        // Generar la data a guardar
        // data.usuario = req.usuarioAutenticado._id;
        const { customer_data } = data;
        const { name } = customer_data;
        data.customer_data.name = name.toUpperCase();

        const order = new Order(data);

        // Guaardar en DB
        await order.save();

        res.status(201).json({
            ok: true,
            order,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Actualizar orden
const updateOrder = async(req = request, res = response) => {

    try {
        const { id } = req.params;
        const { _id, customer_data, order_number, ...data } = req.body

        const order = await Order.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            order,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}


// Borrar cupon - estado:false
// const deleteCoupon = async(req = request, res = response) => {

//     try {

//         const { id } = req.params;

//         //Fisicamente lo borramos
//         // const usuario = await Usuario.findByIdAndDelete(id);

//         const order = await Order.findByIdAndUpdate(id, { status: false }, { new: true });

//         res.json({
//             ok: true,
//             coupon,
//         });
//     } catch (error) {
//         console.log({ error });
//         throw new Error('something went wrong');
//     }
// }


module.exports = {
    createOrder,
    getOrder,
    getOrders,
    updateOrder,
}