const router = require("express").Router();

const MusicController = require("../controller/MusicController");
const verifyToken = require("../middleware/user");
const fileUploader = require("../config/cloudinary.config");
const fileUploader_MP3 = require("../config/cloundinary.config.video");
//@Register

router.post("/create", fileUploader, MusicController.CreateMusic);

router.post("/createShare", MusicController.CreateMusicByShare);

router.delete("/delete", MusicController.Deleted_Music);

router.put("/update", fileUploader, MusicController.Update_Music);
router.put("/updateU", MusicController.Update_Music_ForUser);

router.post("/getallByCID", MusicController.Get_All_Music_By_Category_Id);

router.post("/getallByUserID", MusicController.Get_All_Music_By_UserID);
router.post("/getlike", MusicController.getLike);
router.get("/getall", MusicController.Get_All_Music);

router.put("/like", MusicController.Like);
router.put("/comment", MusicController.Comment);
module.exports = router;
