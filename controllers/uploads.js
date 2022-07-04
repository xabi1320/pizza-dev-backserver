const path = require('path');
const fs = require('fs');

const { request, response } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { Product, Coupon, Ingredient } = require("../models");

const { uploadFile } = require("../utils");

const fileUpload = async(req = request, res = response) => {

    try {
        //Imagenes
        const secureUrl = await uploadFile(req);
        res.status(201).json({
            secureUrl,
        });

    } catch (error) {
        error = String(error)
        res.status(400).json({ error });
    }

}


const updateImage = async(req = request, res = response) => {

        const { id } = req.params;
        const { collecction } = req.body;

        let model, secureUrl;

        switch (collecction.toLowerCase()) {
            case 'products':
                secureUrl = await uploadFile(req, undefined, true);
                model = await Product.findById(id);
                break;
            case 'coupons':
                secureUrl = await uploadFile(req, undefined, true);
                model = await Coupon.findById(id);
                break;
            case 'ingredients':
                secureUrl = await uploadFile(req, undefined, true);
                model = await Ingredient.findById(id);
                break;

            default:
                return res.status(500).json({ msg: 'I forgot to validate this' });
        }
        model.img = secureUrl;

        await model.save();

        res.status(200).json(model);
}


const mostrarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        // Borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}


module.exports = {
    fileUpload,
    mostrarImagen,
    updateImage,
}