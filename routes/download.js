const express = require("express");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


const EXPORTS_DIR = path.join(__dirname, "../exports");


router.get("/download/:filename", authMiddleware, (req, res) => {
  const { filename } = req.params;


  if (!filename || !/^[a-zA-Z0-9._-]+\.xlsx$/.test(filename)) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const filePath = path.join(EXPORTS_DIR, filename);


  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error while downloading file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

module.exports = router;