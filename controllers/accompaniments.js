const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Product } = require('../models')



const searchAccompaniments = async(req = request, res = response) => {

    try {

        const categoryChicken = ObjectId('629d7f9246912e9a98475303');
        const categoryBreads = ObjectId('629d781646912e9a984752f6');
        const categoryPotatoes = ObjectId('629d784f46912e9a984752f9');
        const categoryExtras = ObjectId('629d78f646912e9a98475300');


        const [chicken, breads, potatoes, extras] = await Promise.all([
            Product.find({ category: categoryChicken, $and: [{ status: true }] }).populate('category', 'name'),
            Product.find({ category: categoryBreads, $and: [{ status: true }] }).populate('category', 'name'),
            Product.find({ category: categoryPotatoes, $and: [{ status: true }] }).populate('category', 'name'),
            Product.find({ category: categoryExtras, $and: [{ status: true }] }).populate('category', 'name')
        ]);

        res.json({
            ok: true,
            chicken,
            breads,
            potatoes,
            extras
        })

    } catch (error) {
        console.log({ error });
        throw new Error('something went wrong');
    }
}


module.exports = {
    searchAccompaniments
}