const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  mp3: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    default: 0, // Giá trị mặc định nếu không có giá trị
  },
  ArrayLike: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  ArrayComment: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      content: {},
      updateDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
module.exports = mongoose.model("Music", MusicSchema);
