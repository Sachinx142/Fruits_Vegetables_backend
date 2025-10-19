import fs from "fs"

const deleteImage =  (imagePath) => {
  if(fs.existsSync(`./uploads/${imagePath}`)){
    fs.unlinkSync(`./uploads/${imagePath}`)
  }
}

module.exports = deleteImage