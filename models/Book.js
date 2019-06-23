const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            message: String
        }
    ],
    author: {
        name: String,
        surname: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    star: Number
});

module.exports = mongoose.model("book", BookSchema);