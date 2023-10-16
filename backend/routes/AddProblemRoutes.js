const {Router} = require('express')
const {AddProblems} = require("../controller/AddProblem");
const router = Router();

router.post('/add',AddProblems);

module.exports = router;