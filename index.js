const express = require("express");
const app = express();
const connectDB = require("./config/db")
const cors = require("cors")



     
const blogRoutes = require("./routes/blogRoutes")
const userRoutes = require("./routes/userRoutes")
const testimonialRoutes = require("./routes/testimonialRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const subCategoryRoutes = require("./routes/subCategoryRoutes")
const productRoutes = require("./routes/productRoutes")
const staffRoutes = require("./routes/staffRoutes")
const menuRoutes = require("./routes/menuRoutes")
const roleRoutes = require("./routes/roleRoutes")
const cartRoutes = require("./routes/cartRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")

require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use(cors())


app.use("/api/blogs",blogRoutes)
app.use("/api/user",userRoutes)
app.use("/api/testimonials",testimonialRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/subcategory",subCategoryRoutes)
app.use('/api/product',productRoutes)
app.use('/api/staff',staffRoutes)
app.use('/api/menu',menuRoutes)
app.use('/api/roles',roleRoutes)
app.use('/api/cart',cartRoutes)
app.use("/api/wishlist",wishlistRoutes)
app.use('/api/payment',paymentRoutes)
    
connectDB();


const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})


