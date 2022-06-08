const { Router } = require('express');
const { searchDrinks } = require('../controllers/drinks');


const router = Router();


router.get('/', searchDrinks)


module.exports = router;