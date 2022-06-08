const { Category, Product, Ingredient, Coupon, Order } = require('../models');

/* 
 *Valida si tiene rol ADMIN
 */
// const isValidRole = async(rol = '') => {
//     const existeRol = await Role.findOne({ rol });
//     if (!existeRol) throw new Error(`El rol ${rol} no está registrado en la BD`);
// }


// //Verificar si el correo existe
// const existeEmail = async(correo = '') => {
//     const emailExiste = await Usuario.findOne({ correo });
//     if (emailExiste) throw new Error(`El correo ${correo} ya está registrado`);
// }


/* 
 *Valida si existe el ID de usuario
 */
// const existeUsuarioPorId = async(id) => {
//     const existelUsuario = await Usuario.findById(id);
//     if (!existelUsuario) throw new Error(`El id no existe ${id} `);
// }


/* 
 *Valida si existe el ID de la categoria
 */
const existCategoryID = async(id) => {
    const existCategory = await Category.findById(id);
    if (!existCategory) throw new Error(`ID does not exist: ${id} `);
}


/* 
 *Valida si existe el ID del producto
 */
const existProductID = async(id) => {
    const existProductID = await Product.findById(id);
    if (!existProductID) throw new Error(`ID does not exist: ${id} `);
}

/* 
 *Valida si existe el ID del ingrediente
 */
const existIngredientID = async(id) => {
    const existIngredientID = await Ingredient.findById(id);
    if (!existIngredientID) throw new Error(`ID does not exist: ${id} `);
}

/* 
 *Valida si existe el ID del cupon
 */
const existCouponID = async(id) => {
    const existCouponID = await Coupon.findById(id);
    if (!existCouponID) throw new Error(`ID does not exist: ${id} `);
}

/* 
 *Valida si existe el ID del cupon
 */
const existOrderID = async(id) => {
    const existOrderID = await Order.findById(id);
    if (!existOrderID) throw new Error(`ID does not exist: ${id} `);
}

/* 
 *Valida colecciones permitidas
 */
// const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

//     const incluida = colecciones.includes(coleccion);
//     if (!incluida) throw new Error(`La colección '${coleccion}' no es permitida. Solamente: ${colecciones} `);

//     return true;
// }


module.exports = {
    existCategoryID,
    existProductID,
    existIngredientID,
    existCouponID,
    existOrderID,
}