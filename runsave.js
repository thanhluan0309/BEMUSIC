const fs = require("fs");
const path = require("path");

const data = [];

const imageFolder = path.join(__dirname, "images");

if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}

data.forEach((item) => {
  const fileName = `${item.id}.png`;

  // Kiểm tra nếu dữ liệu là chuỗi base64
  if (
    typeof item.picture === "string" &&
    item.picture.startsWith("data:image/png;base64,")
  ) {
    const base64Data = item.picture.replace(/^data:image\/png;base64,/, "");

    fs.writeFileSync(path.join(imageFolder, fileName), base64Data, "base64");

    console.log(`Đã lưu hình ảnh: ${fileName}`);
  } else {
    console.log(`Dữ liệu hình ảnh không hợp lệ cho ${item.id}`);
  }
});
