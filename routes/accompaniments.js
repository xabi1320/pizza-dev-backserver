const { Router } = require('express');
const { searchAccompaniments } = require('../controllers/accompaniments');


const router = Router();


router.get('/', searchAccompaniments)


module.exports = router;