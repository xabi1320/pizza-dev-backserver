const { ObjectId } = require('mongoose').Types;

const { Product, Coupon } = require("../models");

const validateOrder = ({body}) => {
        
    return new Promise(async(resolve, reject) => {
        const { description } = body;
        const categoryPizzas = ObjectId('629e74fe5fdffe459ac62404');
        try {
            //Busca todas las pizzas y cupones existentes
            const [allPizzas, allCoupons] = await Promise.all([
                Product.find({ category: categoryPizzas, $and: [{ status: true }] }),
                Coupon.find({  status: true  }),
            ]);
            //a partir de la busqueda anterior se generan 2 arrays de obj, con los id y el precio.
            //para pizzas y cupones.
            const pizzasDB = allPizzas.map(pizza =>{
                const id = String(pizza._id) 
                const price = pizza.price
                return {id, price}
            });
            const couponDB = allCoupons.map(pizza =>{
                const id = String(pizza._id) 
                const price = pizza.price
                return {id, price}
            });
            //Se genera un nuevo Array de obj, para la descripcion de la orden
            const newDescription = description.map((pizza) => {
                if (pizza.built == false && pizza.coupon == false) {
                    const {exist, price} = validatePrices(pizza.id, pizzasDB)
                    if (!exist) return reject(`There is no product with the id: ${pizza.id}`);
                    if (price) return {...pizza, price};
                }
                if (pizza.coupon == true && pizza.built == false) {
                    const {exist, price} = validatePrices(pizza.id, couponDB)
                    if (!exist) return reject(`There is no coupon with the id: ${pizza.id}`);
                    if (price) return {...pizza, price}
                }
                if (pizza.built == true && pizza.coupon == false) {
                    const {ingredients} = pizza
                    if (ingredients.length > 3) return {...pizza, price: pizza.price + (((ingredients.length - 3) * 1.50) * pizza.quantity)}
                    return {...pizza}
                }
            });
            //Con la nueva descripcion se proceden a sumar los precios obtenidos de la DB y hacer la suma total
            const totalAmount = await validateAmount(newDescription);
            //Se genera una nueva orden con la nueva descripcion y el monto nuevo
            const order = {...body, description: newDescription, totalAmount}
            resolve(order);
        } catch (error) {
            console.log(error)
            return reject(`${String(error)}`);
        }
    });

}

const validatePrices = (id, pizzas) => {
    let pizzaObj;
    pizzas.forEach(pizza => {
        if (id === pizza.id){
            pizzaObj = {exist: true, price: pizza.price}
        } 
    });

    if(pizzaObj?.exist){
        return pizzaObj;
    }else{
        return pizzaObj = {exist: false}
    }
}

const validateAmount = async (desc) => {
    let sum = 0;
    desc.forEach(({price}) => {
        sum += price;
    });
    return sum;
}

module.exports = {
    validateOrder,
}