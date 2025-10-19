const path = require("path");

const uploadImage = (file) => {
  if (!file) {
    return null;
  }
  
  const imagePath = file.filename;
  return imagePath;
};

module.exports = uploadImage;
