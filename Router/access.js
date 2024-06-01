const router = require("express").Router();
const AccessController = require("../controller/checkAccessController");
const verifyToken = require("../middleware/user");
//@Register
router.get("/", verifyToken, AccessController.checkAccess);

module.exports = router;
