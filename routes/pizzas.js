const { Router } = require('express');
const { searchPizzas } = require('../controllers/pizzas');


const router = Router();


router.get('/', searchPizzas)


module.exports = router;