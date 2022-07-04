const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { Product, Coupon, Ingredient } = require("../models");

const uploadFile = ({params, body, files}, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], update = false) => {
    
    return new Promise(async(resolve, reject) => {
        const { id } = params;
        const { collecction } = body;
        const { img } = files;

        const cutName = img.name.split('.');
        const extension = cutName[cutName.length - 1];
        if (!validExtensions.includes(extension)) {
            return reject(`Format '${extension}' It's not valid. Only allowed: ${validExtensions}`)
        }
        try {   
            if (update) { 
                let model;
                switch (collecction.toLowerCase()) {
                    case 'products':
                        model = await Product.findById(id);
                        if (!model) {
                            return reject(`There is no user with the id: ${id}`);
                        }
                        break;
                    case 'coupons':
                        model = await Coupon.findById(id);
                        if (!model) {
                            return reject(`There is no coupon with the id: ${id}`);
                        }
                        break;
                    case 'ingredients':
                        model = await Ingredient.findById(id);
                        if (!model) {
                            return reject(`There is no ingredient with the id: ${id}`);
                        }
                        break;
                    default:
                         return reject({ msg: 'I forgot to validate this' });
                }
                // Limpiar imagenes previas
                if (model.img) {
                    const nameArr = model.img.split('/');
                    const name = nameArr[nameArr.length - 1];
                    const [public_id] = name.split('.');
                    cloudinary.uploader.destroy(public_id);
                }
            }
    
            const { tempFilePath } = img;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            resolve(secure_url);
        } catch (error) {
            return reject(`${String(error)}`)
        }
    });
    
    
    
    // try {
    //     const { id } = params;
    //     const { collection } = body;
    //     const { file } = files;

    //     const cutName = file.name.split('.');
    //     const extension = cutName[cutName.length - 1];
    //     if (!validExtensions.includes(extension)) {
    //         throw new Error(`Format '${extension}' It's not valid. Only allowed: ${validExtensions}`)
    //     }

    //     if (action.toLowerCase() === 'update') {          
    //         let model;
    //         switch (collection.toLowerCase()) {
    //             case 'products':
    //                 model = await Product.findById(id);
    //                 if (!model) {
    //                     throw new Error({
    //                         msg: `There is no user with the id: ${id}`
    //                     });
    //                 }
    //                 break;
    //             case 'coupons':
    //                 model = await Coupon.findById(id);
    //                 if (!model) {
    //                     throw new Error({
    //                         msg: `There is no coupon with the id: ${id}`
    //                     });
    //                 }
    //                 break;
    //             case 'ingredients':
    //                 model = await Ingredient.findById(id);
    //                 if (!model) {
    //                     throw new Error({
    //                         msg: `There is no ingredient with the id: ${id}`
    //                     });
    //                 }
    //                 break;
    //             default:
    //                  throw new Error({ msg: 'I forgot to validate this' });
    //         }
    //         // Limpiar imagenes previas
    //         if (model.img) {
    //             const nameArr = model.img.split('/');
    //             const name = nameArr[nameArr.length - 1];
    //             const [public_id] = name.split('.');
    //             cloudinary.uploader.destroy(public_id);
    //         }
    //     }

    //     const { tempFilePath } = file;
    //     const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    //     return secure_url; 
    // } catch (error) {
    //     // console.log(error);
    //     error = String(error);
    //     throw new Error(error);
    // }

        // const { file } = files;
        // const cutName = file.name.split('.');
        // const extension = cutName[cutName.length - 1];

        // Validar la extension
        // if (!validExtensions.includes(extension)) {
        //     return reject(`Format '${extension}' It's not valid. 
        //     Only allowed: ${validExtensions}`)
        // }


}


module.exports = {
    uploadFile,
}