const config = require('config');
const multer = require('multer');

const dest = config.get("app").tmp;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //files destination upload
      cb(null, dest) 
    },
    filename: function (req, file, cb) {
      
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
      cb(null, filename + '-' + file.originalname )
    }
  })
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const uploadMiddleware = multer({ storage: storage })

module.exports = uploadMiddleware;