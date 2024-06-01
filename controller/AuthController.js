const User = require("../model/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// Lấy thời gian hiện tại

require("dotenv").config();

class UserController {
  async Accespublc(req, res) {
    const { name, password, repassword } = req.body;

    if (!name || !password || !repassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin !",
      });
    } else {
      const UserExit = await User.findOne({ name: name });
      if (UserExit) {
        return res
          .status(400)
          .json({ succes: false, message: "Tài khoản đã tồn tại" });
      } else {
        const fileData = req.file;
        const hashpassword = await argon2.hash(password);
        const regex = /^.{6,50}$/;
        const a = regex.test(password);
        if (!a) {
          return res.status(400).json({
            success: false,
            message: "Mật khẩu phải có độ dài từ 6-50 kí tự !",
          });
        }
        const newUser = User({
          name,
          password: hashpassword,
          roles: process.env.USER,
          account_image: process.env.DEFAULT_IMG,
        });
        await newUser.save();

        res
          .status(200)
          .json({ success: true, message: "Tạo tài khoản thành công" });
      }
    }
  }
  async Login(req, res) {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản mật khẩu không được để trống !",
      });
    } else {
      const UserExit = await User.findOne({ name: name });
      if (!UserExit) {
        return res
          .status(400)
          .json({ success: false, message: "Tài khoản không hợp lệ!" });
      } else {
        const passwordValid = await argon2.verify(UserExit.password, password);
        if (!passwordValid) {
          return res
            .status(400)
            .json({ success: false, message: "Mật khẩu không hợp lệ!" });
        } else {
          const Accesstoken = jwt.sign(
            { UserExit: UserExit },
            process.env.Accestoken,
            { expiresIn: "3h" }
          );

          res.status(200).json({
            success: true,
            user: UserExit,
            Accesstoken: Accesstoken,
            message: "Đăng nhập thành công",
          });
        }
      }
    }
  }
  async Update(req, res) {
    const { name, password, _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Id không hợp lệ!" });
    } else {
      const CustomerExists = await User.findOne({
        _id: _id,
      });
      if (CustomerExists) {
        const fileData = req.file;
        const hashpassword = await argon2.hash(password);
        const regex = /^.{6,50}$/;
        const a = regex.test(password);
        if (a) {
          console.log("Mật khẩu hợp lệ!");
        } else {
          console.log("Mật khẩu không hợp lệ!");
          return res.status(400).json({
            success: false,
            message: "Mật khẩu phải có độ dài từ 6-50 kí tự !",
          });
        }
        const updateUser = {
          name,
          password: hashpassword,

          account_image: fileData?.path,
        };
        const UserUpdateCondition = { _id: _id };
        const check = await User.findByIdAndUpdate(
          UserUpdateCondition,
          updateUser,
          { new: true }
        );
        if (check) {
          return res.status(200).json({
            success: true,
            update: check,
            message: "Cập nhật thành công",
          });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Khách hàng không tồn tại" });
      }
    }
  }

  async Update_Role_for_User(req, res) {
    const { roles, _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Id không hợp lệ!" });
    } else {
      const updateUser = {
        roles: roles,
      };
      const UserUpdateCondition = { _id: _id };
      const check = await User.findByIdAndUpdate(
        UserUpdateCondition,
        updateUser,
        { new: true }
      );
      if (check) {
        return res.status(200).json({
          success: true,
          update: check,
          message: "Cập nhật thành công",
        });
      }
    }
  }
  // Delete function with middleware
  async Delete(req, res) {
    try {
      const { _id } = req.body; // Assuming the id is passed as '_id'

      await User.findOneAndDelete({ _id: _id });
      res
        .status(200)
        .json({ success: true, message: "Xóa khách hàng thành công" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi trong quá trình xóa khách hàng",
      });
    }
  }
  async Get_All_User(req, res) {
    const getallByUser = await User.find();
    res.status(200).json({
      success: true,
      alluser: getallByUser,
    });
  }

  async Get_All_User_By_UserID(req, res) {
    const { _id } = req.body;

    const getuser = await User.findOne({ _id: _id });
    res.status(200).json({
      success: true,
      user: getuser,
    });
  }
}
module.exports = new UserController();
