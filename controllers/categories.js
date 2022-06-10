const { request, response } = require('express');

const { Category } = require('../models');


// Obtener categorias - paginado - total - populate
const getCategories = async(req = request, res = response) => {
    const { since = 0, limit = 5 } = req.query;
    const query = { status: true };

    try {
        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query),
        ]);

        res.status(200).json({
            ok: true,
            total,
            categories
        });
    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong')
    }

}

// Obtener categoria -populate{}
const getCategory = async(req = request, res = response) => {
    const { id } = req.params;

    try {

        const category = await Category.findById(id);

        res.json({
            ok: true,
            category
        });
    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong')
    }
}

// Crear Categoria
const createCategory = async(req = request, res = response) => {

    try {
        const name = req.body.name.toUpperCase();
        const categoryDB = await Category.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                ok: false,
                msg: `Category '${categoryDB.name}', already exist`
            });
        }

        // Generar la data a guardar
        const data = {
            name,
            // usuario: req.user._id,
        }

        const category = new Category(data);

        // Guaardar en DB
        await category.save();

        res.status(201).json({
            ok: true,
            category
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong')
    }
}

// Actualizar categoria
const updateCategory = async(req = request, res = response) => {

    try {
        const { id } = req.params;
        const { _id, status, ...data } = req.body
        const name = data.name.toUpperCase();
        data.name = name;

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            category,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong')
    }
}


// Borrar Categoria - estado:false
const deleteCategory = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        //Fisicamente lo borramos
        // const usuario = await Usuario.findByIdAndDelete(id);

        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            ok: true,
            category,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong')
    }
}


module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
}