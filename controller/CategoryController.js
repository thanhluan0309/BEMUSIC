const Category = require("../model/category");

require("dotenv").config();

class CategoryController {
  async createCategory(req, res) {
    const { name } = req.body;
    try {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Thông tin không được để trống",
        });
      } else {
        const newCate = Category({
          name: name,
        });
        await newCate.save();

        res.status(200).json({
          success: true,
          message: "Đã thêm thành công",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async Get_All_Category(req, res) {
    try {
      const getALLC = await Category.find();

      res.status(200).json({ success: true, All_Category: getALLC });
    } catch (err) {
      console.log(err);
    }
  }

  async Update_Category(req, res) {
    const { id, name } = req.body;
    try {
      {
        let updateCategory = {
          name,
        };

        const ProductUpdatecondition = { _id: id };

        updateCategory = await Category.findByIdAndUpdate(
          ProductUpdatecondition,
          updateCategory,
          { new: true }
        );

        return res.status(200).json({
          success: true,
          update: updateCategory,
          Message: "Cập nhật thành công",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Deleted_Category(req, res) {
    const { id } = req.body;

    try {
      const PostUpdatecondition = { _id: id };
      await Category.findByIdAndDelete(PostUpdatecondition);

      res.status(200).json({ success: true, message: "Xoá thành công !!" });
    } catch (err) {
      res.status(500).json({ success: false, message: err });
    }
  }
}
module.exports = new CategoryController();
