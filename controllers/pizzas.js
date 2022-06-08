const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Product } = require('../models')



const searchPizzas = async(req = request, res = response) => {

    try {
        const categoryPizzas = ObjectId('629e74fe5fdffe459ac62404');
        const pizzas = await Product.find({ category: categoryPizzas, $and: [{ status: true }] }).populate('category', 'name');


        res.json({
            ok: true,
            pizzas,
        });

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }


}


module.exports = {
    searchPizzas,
}