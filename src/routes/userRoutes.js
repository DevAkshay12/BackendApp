const express = require("express");
const auth = require("../middleware/auth");
const {
  getUsers,
  loginUser,
  validateUser,
  createUser
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.get("/validate", validateUser);
router.get("/", auth, getUsers);
router.post("/", auth, createUser);

module.exports = router;
