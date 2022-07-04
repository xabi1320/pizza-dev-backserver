const { request, response } = require('express');

const { Ingredient } = require('../models');


// Obtener ingredientes - paginado - total - populate
const getIngredients = async(req = request, res = response) => {
    try {
        const { since = 0, limit = 5 } = req.query;
        const query = { status: true };

        const [total, ingredients] = await Promise.all([
            Ingredient.countDocuments(query),
            Ingredient.find(query).populate('category', 'name'),
        ]);

        res.status(200).json({
            ok: true,
            total,
            ingredients
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Obtener ingrediente -populate{}
const getIngredient = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const ingredient = await Ingredient.findById(id).populate('category', 'name');

        res.status(200).json({
            ok: true,
            ingredient
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}

// Crear ingrediente
const createIngredient = async(req = request, res = response) => {
    try {
        const { img } = req.files ? req.files : req.body;
        const data = req.body;
        const name = data.name.toUpperCase();
        const ingredientDB = await Ingredient.findOne({ name });

        if (ingredientDB) {
            return res.status(400).json({
                ok: false,
                msg: `Ingredient '${ingredientDB.name}', already exist`
            });
        }
        // Generar la data a guardar
        data.name = name
        data.img = img ? await uploadFile(req) : '';

        const ingredient = new Ingredient(data);
        // Guaardar en DB
        await ingredient.save();

        res.status(201).json({
            ok: true,
            ingredient
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}

// Actualizar ingrediente
const updateIngredient = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, status, category, ...data } = req.body
        const name = data.name && data.name.toUpperCase();
        data.name = data.name && name;
        if (req.files) data.img = await uploadFile(req, undefined, true);

        const ingredient = await Ingredient.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            ok: true,
            ingredient,
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


// Borrar Ingrediente - estado:false
const deleteIngredient = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const ingredient = await Ingredient.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            ok: true,
            ingredient,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: String(error),
        });
    }
}


module.exports = {
    createIngredient,
    deleteIngredient,
    getIngredient,
    getIngredients,
    updateIngredient,
}