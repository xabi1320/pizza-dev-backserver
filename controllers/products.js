const { request, response } = require('express');

const { Product } = require('../models');


// Obtener productos - paginado - total - populate
const getProducts = async(req = request, res = response) => {

    try {
        const { since = 0, limit = 5 } = req.query;
        const query = { status: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).populate('category', 'name'),
        ]);

        res.json({
            ok: true,
            total,
            products
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Obtener producto -populate{}
const getProduct = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate('category', 'name');

        res.json({
            ok: true,
            product
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Crear producto
const createProduct = async(req = request, res = response) => {

    try {
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
        // data.usuario = req.usuarioAutenticado._id;
        data.name = name

        const product = new Product(data);

        // Guaardar en DB
        await product.save();

        res.status(201).json({
            ok: true,
            product
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Actualizar producto
const updateProduct = async(req = request, res = response) => {

    try {
        const { id } = req.params;
        const { _id, status, category, ...data } = req.body
        const name = data.name.toUpperCase();
        data.name = name;

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            product,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
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
        console.log({ error });
        throw new Error('something went wrong');
    }
}


module.exports = {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
}