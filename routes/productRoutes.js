const express = require("express");
const router = express.Router()
const {getAllProducts,createProduct,updateProduct, getProductById,deleteProduct,changeStatus,getAllActiveProducts, getProductBySlug} = require("../controller/productController");
const upload = require("../middleware/fileupload");


const multiUpload = upload.fields([
  { name: "productImage", maxCount: 1 },
]);


router.get('/getAllProducts',getAllProducts);
router.get('/getAllActiveProducts',getAllActiveProducts);
router.post('/getProductBySlug',getProductBySlug);
router.post('/getProductById',getProductById);
router.post('/createProduct',multiUpload,createProduct);
router.post('/updateProduct',multiUpload,updateProduct);
router.post('/deleteProduct',deleteProduct);
router.post('/changeStatus',changeStatus);


module.exports = router
