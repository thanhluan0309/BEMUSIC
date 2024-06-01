const Music = require("../model/music");
const User = require("../model/user");
const mongoose = require("mongoose");
class MusicController {
  async CreateMusic(req, res) {
    try {
      const imageFile = req.files["file"][0] || "...";
      const mp3File = req?.files["mp3"][0] || "....";
      const { name, description, view, category_Id, userID } = req.body;
      try {
        if (!name || !description || !view || !userID) {
          res
            .status(400)
            .json({ success: false, Message: "Dữ liệu không được để trống" });
        } else {
          const newMusic = Music({
            id: mongoose.Types.ObjectId(),
            name,
            picture: imageFile.path || "...",
            description,
            view,
            mp3: mp3File.path || "...",

            userID: userID,
          });
          await newMusic.save();
          return res.status(200).json({
            success: true,
            newMusic: newMusic,
            Message: "Đã thêm thành công",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, Message: "Chưa có dử liệu file" });
    }
  }
  async CreateMusicByShare(req, res) {
    try {
      const { name, description, picture, mp3, userID } = req.body;
      try {
        if (!name || !description || !userID) {
          res
            .status(400)
            .json({ success: false, Message: "Dữ liệu không được để trống" });
        } else {
          const newMusic = Music({
            id: mongoose.Types.ObjectId(),
            name,
            picture: picture,
            description,

            mp3: mp3,

            userID: userID,
          });
          await newMusic.save();
          return res.status(200).json({
            success: true,
            newMusic: newMusic,
            Message: "Đã thêm thành công",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, Message: "Chưa có dử liệu file" });
    }
  }

  async Update_Music(req, res) {
    const { id, name, description, view, category_Id, userID } = req.body;
    try {
      let update_Music = {
        id,
        name,
        description,
        view,
      };
      if (req?.files["file"]) {
        update_Music = {
          ...update_Music,
          picture: req?.files["file"][0]?.path,
        };
      }
      if (req?.files["mp3"]) {
        update_Music = { ...update_Music, mp3: req?.files["mp3"][0]?.path };
      }
      const MusicUpdatecondition = { id: id };

      update_Music = await Music.findOneAndUpdate(
        MusicUpdatecondition,
        update_Music,
        { new: true }
      );
      console.log("update_Music " + update_Music);
      return res.status(200).json({
        success: true,
        update_Music: update_Music,
        Message: "Update Success",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async Update_Music_ForUser(req, res) {
    const { id } = req.body;
    try {
      {
        let UpdateMusic = { $inc: { view: 1 } };
        const ProductUpdatecondition = { id: id };

        UpdateMusic = await Music.findOneAndUpdate(
          ProductUpdatecondition,
          UpdateMusic,
          { new: true }
        );

        return res.status(200).json({
          success: true,
          update: UpdateMusic,
          Message: "Cập nhật thành công",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async Deleted_Music(req, res) {
    const { id, category_Id } = req.body;

    try {
      const PostUpdatecondition = { id: id };
      await Music.findOneAndDelete(PostUpdatecondition);

      res.status(200).json({ success: true, message: "Delete success" });
    } catch (err) {
      res.status(500).json({ success: false, message: "can't Deleted Post" });
    }
  }

  async Get_All_Music_By_Category_Id(req, res) {
    const { category_Id } = req.body;
    try {
      const getALLProduct = await Music.find({
        category_Id: category_Id,
      });
      res.status(200).json({ success: true, All_music: getALLProduct });
    } catch (err) {
      console.log(err);
    }
  }

  async Get_All_Music(req, res) {
    try {
      const getALLProduct = await Music.find()
        .populate("userID")
        .populate("ArrayLike._id", "name account_image") // Populate ArrayLike with user data
        .populate("ArrayComment._id", "name account_image") // Populate ArrayComment with user data

        .exec();
      res.status(200).json({ success: true, All_music: getALLProduct });
    } catch (err) {
      console.log(err);
    }
  }
  async Get_All_Music_By_UserID(req, res) {
    const { userID } = req.body;

    try {
      const getALLProduct = await Music.find({ userID: userID })
        .populate({
          path: "userID",
          select: "-password", // Loại trừ trường password
        })
        .populate("ArrayLike._id", "name account_image") // Populate ArrayLike with user data
        .populate("ArrayComment._id", "name account_image") // Populate ArrayComment with user data
        .exec();
      res.status(200).json({ success: true, All_music: getALLProduct });
    } catch (err) {
      console.log(err);
    }
  }
  async Like(req, res) {
    try {
      const { _id, id } = req.body; // Assuming userId and musicId are sent in the request body

      // Validate the incoming data
      if (!_id || !id) {
        return res.status(400).json({ error: "Nhập đầy đủ thông tin!" });
      }

      // Check if the user exists
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "Khách hàng không tồn tại!" });
      }

      // Check if the music exists
      const music = await Music.findById(id);
      if (!music) {
        return res.status(404).json({ error: "Bản nhạc không tồn tại!" });
      }

      // Add user's _id to the ArrayLike array of the music
      music.ArrayLike.push({ _id: _id });
      await music.save();

      res.status(200).json({ message: "Thả tim thành công !!" });
    } catch (error) {
      console.error("Lỗi khi thả tim nhạc:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async Comment(req, res) {
    try {
      const { _id, id, content } = req.body; // Assuming userId, musicId, and content are sent in the request body

      // Validate the incoming data
      if (!_id || !id || !content) {
        return res.status(400).json({ error: "Nhập đầy đủ thông tin!" });
      }

      // Check if the user exists
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "Khách hàng không tồn tại!" });
      }

      // Check if the music exists
      const music = await Music.findById(id);
      if (!music) {
        return res.status(404).json({ error: "Bản nhạc không tồn tại!" });
      }

      // Add user's comment to the ArrayComment array of the music
      music.ArrayComment.push({
        _id: _id,
        content,
        updateDate: new Date().toISOString(),
      });
      await music.save();

      res.status(200).json({ message: "Bạn đã đăng bình luận thành công" });
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getLike(req, res) {
    try {
      const { _id } = req.body; // Assuming the user ID is sent in the request body

      // Validate the incoming data
      if (!_id) {
        return res.status(400).json({ error: "Nhập đầy đủ thông tin!" });
      }

      // Check if the user exists
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "Khách hàng không tồn tại!" });
      }

      // Retrieve music liked by the user
      const likedMusic = await Music.find({ "ArrayLike._id": _id }).populate(
        "userID"
      );
      // .populate("ArrayLike._id", "name account_image");
      //;sao
      res.status(200).json({ success: true, userlike: likedMusic });
    } catch (error) {
      console.error("Lỗi", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async GetMusicById(req, res) {
    const { id } = req.params;

    try {
      const music = await Music.findById(id)
        .populate("ArrayLike._id", "name account_image") // Populate ArrayLike with user data
        .populate("ArrayComment._id", "name account_image"); // Populate ArrayComment with user data

      if (!music) {
        return res.status(404).json({ error: "Bản nhạc không tồn tại!" });
      }

      res.status(200).json({ success: true, music });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhạc:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new MusicController();
