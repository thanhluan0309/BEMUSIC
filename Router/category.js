const router = require("express").Router();
const CategoryController = require("../controller/CategoryController");
const verifyToken = require("../middleware/user");

//@Register
router.post("/create", verifyToken, CategoryController.createCategory);

router.delete("/delete", verifyToken, CategoryController.Deleted_Category);

router.put("/update", verifyToken, CategoryController.Update_Category);

router.get("/getall", CategoryController.Get_All_Category);

module.exports = router;
