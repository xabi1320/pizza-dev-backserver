const { request, response } = require('express');
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("yappy-node-back-sdk");

const { Order } = require('../models');
const { validateOrder } = require('../utils');

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
        res.status(400).json({error});
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
        res.status(400).json({error});
    }
}

// Crear orden
const createOrder = async(req = request, res = response) => {
    try {
        const data = req.body;
        const orderNumber = data.orderNumber;
        let [orderDB, count] = await Promise.all([
            Order.findOne({orderNumber}),
            Order.count(),
        ]);

        count === 0 ? data.orderNumber = 1 : data.orderNumber = count + 1 ;

        if (orderDB) {
            return res.status(400).json({
                ok: false,
                msg: `Order '${orderDB.orderNumber}', already exist`
            });
        }
        // Generar la data a guardar
        const { customerData } = data;
        const { name } = customerData;
        data.customerData.name = name.toUpperCase();

        //Validar Orden
        const validOrder = await validateOrder(req);
        if (!validOrder) {
            return res.status(400).json({
                ok: false,
                msg: `The order is not valid`
            });
        }
        
        const order = new Order(data);
        // Guaardar en DB
        await order.save();

        res.status(201).json({
            ok: true,
            order,
        });
    } catch (error) {
        res.status(400).json({error});
    }
}

// Crear enlace de pago Yappy
const createYappyUrl = async(req = request, res = response)=>{
    const yappyClient = createClient(process.env.MERCHANT_ID, process.env.SECRET_KEY);
    const payment = {
        total: null,
        subtotal: null,
        shipping: 0.0,
        discount: 0.0,
        taxes: null,
        orderId: null,
        successUrl: "https://dromelpizzadev.netlify.app/seguimiento",
        failUrl: "https://www.yappy.peqa.dev",
        tel: process.env.TEL || "66666666",
        domain: process.env.DOMAIN || "https://yappy.peqa.dev",
    };
    try {
        const { totalAmount: subtotal } = await validateOrder(req);
        const uuid = uuidv4();
        const taxes = Number((subtotal * 0.07).toFixed(2));
        const total = subtotal + taxes;
        const newPayment = {
            ...payment,
            subtotal: 0.01, // Para evitar tener que pagar durante la prueba
            taxes: 0.01, // Para evitar tener que pagar durante la prueba
            total: 0.02, // Para evitar tener que pagar durante la prueba
            orderId: uuid.split("-").join("").slice(0, 10),
        };
        const response = await yappyClient.getPaymentUrl(newPayment);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error});
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
        res.status(400).json({error});
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
    createYappyUrl,
    getOrder,
    getOrders,
    updateOrder,
}