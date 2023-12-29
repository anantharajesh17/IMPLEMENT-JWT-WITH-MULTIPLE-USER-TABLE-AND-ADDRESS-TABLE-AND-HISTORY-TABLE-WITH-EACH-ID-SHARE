const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const requireAuth = require('../middleware/requireAuth')
router.use(express.json());

router.post("/",userController.register);
router.put("/:userId",userController.update);
router.get("/his",userController.historytable);
router.post("/login",userController.login);
router.get("/",requireAuth,userController.findone);
router.get("/histoken",userController.getAddressByToken);

module.exports = router;