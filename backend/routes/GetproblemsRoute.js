const {Router} = require('express')
const router = Router();
const {GetProblems} = require('../controller/GetAllProblems');

router.get('/problems',GetProblems);

module.exports = router;
