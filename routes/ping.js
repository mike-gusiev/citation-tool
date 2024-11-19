const express = require("express");
const router = express.Router();
// const { checkAllowedIPsForPing } = require("../middlewares/checkAllowedIPsForPing");
const { handlePing } = require("../controllers/pingController");



router.get("/pingback",  handlePing);

module.exports = router;
