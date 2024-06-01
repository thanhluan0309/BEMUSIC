const router = require("express").Router();
const AuthController = require("../controller/AuthController");
const { upload, uploader } = require("../middleware/uploader");
const {
  Delete,
  deleteImageFromCloudinary,
} = require("../middleware/deleteimage");
const verifyToken = require("../middleware/user");

//@Register

router.post(
  "/register",
  upload.single("account_image"),
  uploader,
  AuthController.Accespublc
);
router.post("/login", AuthController.Login);
router.put(
  "/update",
  upload.single("account_image"),

  AuthController.Update
);
router.put("/updateRuser", verifyToken, AuthController.Update_Role_for_User);
router.delete("/delete", deleteImageFromCloudinary, AuthController.Delete);

router.get("/getalluser", AuthController.Get_All_User);
router.post(
  "/getuser",

  AuthController.Get_All_User_By_UserID
);
module.exports = router;
