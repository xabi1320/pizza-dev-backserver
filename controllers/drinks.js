const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Product } = require('../models')



const searchDrinks = async(req = request, res = response) => {
    try {
        const categoryDrinks = ObjectId('629d787c46912e9a984752fc');

        const drinks = await Product.find({ category: categoryDrinks, $and: [{ status: true }] }).populate('category', 'name');


        res.json({
            ok: true,
            drinks,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}


module.exports = {
    searchDrinks
}