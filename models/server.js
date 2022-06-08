const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Routes Paths
        this.paths = {
            accompaniments: '/api/v1/accompaniments',
            categories: '/api/v1/categories',
            coupons: '/api/v1/coupons',
            drinks: '/api/v1/drinks',
            ingredients: '/api/v1/ingredients',
            orders: '/api/v1/orders',
            pizzas: '/api/v1/pizzas',
            products: '/api/v1/products',
        };

        //Conectar DB
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async connectDB() {
        await dbConnection()
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.accompaniments, require('../routes/accompaniments'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.coupons, require('../routes/coupons'));
        this.app.use(this.paths.drinks, require('../routes/drinks'));
        this.app.use(this.paths.ingredients, require('../routes/ingredients'));
        this.app.use(this.paths.orders, require('../routes/orders'));
        this.app.use(this.paths.pizzas, require('../routes/pizzas'));
        this.app.use(this.paths.products, require('../routes/products'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}


module.exports = {
    Server
}