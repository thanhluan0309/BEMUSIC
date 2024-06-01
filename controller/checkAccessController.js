require("dotenv").config();

class checkAccessController {
  async checkAccess(req, res) {
    try {
      if (req.UserExit.roles === process.env.ADMIN) {
        {
          return res.status(200).json({ success: true });
        }
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Account not have access" });
      }
    } catch (Err) {
      console.log(Err);
      return res
        .status(200)
        .json({ success: false, message: "Something worng" });
    }
  }
}
module.exports = new checkAccessController();
