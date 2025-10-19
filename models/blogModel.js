const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    blogName: {
        type: String,
        default: null
    },
    blogSlug: {
        type: String,
        default: null
    },
    blogImage: {
        type: String,
        default: null
    },
    blogContent: {
        type: String,
        default: null
    },
    blogDate: {
        type: String,
        default: null
    },
    publisherName: {
        type: String,
        default: null
    },
    blogDescription: {
        type: String,
        default: null
    },
    title: {
        type: String,
        default: null
    },
    keywords: {
        type: String,
        default: null
    },
    metaDescription: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1
    }
})

const blogModel =  mongoose.model("blogModel", blogSchema);
module.exports = blogModel