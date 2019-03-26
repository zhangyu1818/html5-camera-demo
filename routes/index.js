const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dayjs = require("dayjs");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const mkdirSync = dirname => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname;
    const date = dayjs().format("YYYY-MM");
    const path = `uploads/${type}/${date}`;
    mkdirSync(path);
    cb(null, "./" + path);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.replace("image/", ".");
    const md5 = crypto.createHash("md5");
    const fileName = dayjs().format("YYYY/MM/DD/ss/SSS") + file.originalname;
    const hashName =
      md5.update(fileName).digest("hex") +
        path.extname(file.originalname) +
        ext || "";
    cb(null, hashName);
  }
});

const upload = multer({ storage });

router.post("/api/upload", upload.any(), function(req, res, next) {
  const { files } = req;
  const data = [];
  files.forEach(item => {
    const { originalname, path } = item;
    data.push({ originalname, path });
  });
  res.send({ files: data });
});

module.exports = router;
