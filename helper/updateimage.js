// const {writeFile} = require("fs/promises")
// const fs = require("fs");

// const updateImage = async (image, currentImage) => {
//     let imagePath;
//     console.log(image != currentImage)
//     if (image != currentImage) {
//         const imageByteData = await image.arrayBuffer();
//         const imageBuffer = Buffer.from(imageByteData);
//         imagePath = `${Date.now()}-${image.name}`
//         await writeFile(`./uploads/${imagePath}`, imageBuffer);

//         if (fs.existsSync(`./uploads/${currentImage}`)) {
//             fs.unlinkSync(`./uploads/${currentImage}`)
//         }
//     } else {
//         imagePath = image
//     }
//     return imagePath;
// }

// module.exports = updateImage

const { writeFile } = require("fs/promises");
const fs = require("fs");

const updateImage = async (image, currentImage) => {
  let imagePath;

  if (!image) {
    return currentImage; // no new image uploaded
  }

  // generate new filename
  const newImageName = `${Date.now()}-${image.originalname}`;
  const newImagePath = `./uploads/${newImageName}`;

  // save uploaded buffer to disk
  if (image.buffer) {
    await writeFile(newImagePath, image.buffer);
  }

  // remove old file if exists
  if (currentImage && fs.existsSync(`./uploads/${currentImage}`)) {
    fs.unlinkSync(`./uploads/${currentImage}`);
  }

  return newImageName; // store only filename in DB
};

module.exports = updateImage;
