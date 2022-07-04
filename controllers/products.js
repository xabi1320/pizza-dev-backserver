const path = require('path');
const fs = require('fs');
const { request, response } = require('express');

const { Product } = require('../models');
const { uploadFile } = require('../utils');


// Obtener productos - paginado - total - populate
const getProducts = async(req = request, res = response) => {

    try {
        const { since = 0, limit = 5 } = req.query;
        const query = { status: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).populate('category', 'name'),
        ]);

        res.status(200).json({
            ok: true,
            total,
            products
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}

// Obtener producto -populate{}
const getProduct = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate('category', 'name');

        res.status(200).json({
            ok: true,
            product
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}

// Crear producto
const createProduct = async(req = request, res = response) => {
    try {
        const { img } = req.files ? req.files : req.body;
        const data = req.body;
        const name = data.name.toUpperCase();
        const productDB = await Product.findOne({ name });

        if (productDB) {
            return res.status(400).json({
                ok: false,
                msg: `Product '${productDB.name}', already exist`
            });
        }
        // Generar la data a guardar
        data.name = name;
        data.img = img ? await uploadFile(req) : '';

        const product = new Product(data);
        // Guaardar en DB
        await product.save();

        res.status(201).json({
            ok: true,
            product
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}

// Actualizar producto
const updateProduct = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, status, category, ...data } = req.body
        const name = data.name && data.name.toUpperCase();
        data.name = data.name && name;
        if (req.files) data.img = await uploadFile(req, undefined, true);

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            product,
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


// Borrar Producto - estado:false
const deleteProduct = async(req = request, res = response) => {

    try {

        const { id } = req.params;

        //Fisicamente lo borramos
        // const usuario = await Usuario.findByIdAndDelete(id);

        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            ok: true,
            product,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


module.exports = {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
}