const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const {validateToken }= require('../middleware/validatetoken');
router.use(express.json());

router.post("/",userController.register);
router.put("/:userId",userController.update);
router.get("/his",userController.historytable);
router.post("/login",userController.login);
router.get("/address",userController.findone);
// router.get("/vv",validateToken.validateToken2)

module.exports = router;