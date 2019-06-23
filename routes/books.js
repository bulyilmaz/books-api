const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Book = require("../models/Book");

// GET /books
router.get("/", (req, res) => {
    /*Book.find({}, "", (error, data) => {
        res.json(data);
    });*/
    Book.find({}, "")
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

// GET /books/aggregate
router.get("/aggregate", (req, res) => {
    Book.aggregate([
        {
            $lookup: {
                localField: "authorId",
                from: "authors",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: {
                path: "$author",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    title: "$title",
                    published: "$published",
                    comments: "$comments",
                    star: "$star",
                    createdAt: "$createdAt"
                },
                author: {
                    $push: "$author"
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                title: "$_id.title",
                published: "$_id.published",
                comments: "$_id.comments",
                star: "$_id.star",
                createdAt: "$_id.createdAt",
                author: "$author"
            }
        }
    ])
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

/*router.post("/books", (req, res) => {
    res.json(req.body);
});*/

// POST /books
router.post("/", (req, res) => {
    const book = new Book({
        title: "Başlık",
        comments: [
            {
                message: "Yorum 1"
            },
            {
                message: "Yorum 2"
            }
        ],
        author: {
            name: "Ad",
            surname: "Soyad"
        },
        star: 10
    });

    book.save()
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

/*router.get("/search", (req, res) => {
    Book.find({ published: false }, "title author")
        .then(data => res.json(data))
        .catch(error => res.json(error));
});*/

// GET /books/last5
router.get("/last5", (req, res) => {
    Book.find({}, "").limit(5).sort({ createdAt: -1 })
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

// GET /books/star-between/{start}/{end}
/*router.get("/star-between/:start/:end", (req, res) => {
    const {
        start,
        end
    } = req.params;

    Book.find({
        star: {
            "$gte": Number(start),
            "$lte": Number(end)
        }
    }, "")
        .then(data => res.json(data))
        .catch(error => res.json(error));
});*/

// GET /books/star-between?start={start}&end={end}
router.get("/star-between", (req, res) => {
    const {
        start,
        end
    } = req.query;

    Book.find({
        star: {
            "$gte": Number(start),
            "$lte": Number(end)
        }
    }, "")
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

// GET /books/{bookId}
router.get("/:id", (req, res, next) => {
    Book.findById(req.params.id)
        .then(data => {
            if (!data) {
                next({ code: 99, message: "The book was not found!" });
            }

            res.json(data);
        })
        .catch(error => res.json(error));
});

/*router.put("/", (req, res) => {
    Book.updateMany({
        published: false
    }, {
        published: true
    })
        .then(data => res.json(data))
        .catch(error => res.json(error));
});*/

// PUT /books/{bookId}
router.put("/:id", (req, res) => {
    /*Book.findByIdAndUpdate(req.params.id, {
        title: "hello world"
    })
        .then(data => res.json(data))
        .catch(error => res.json(error));*/
    Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

// DELETE /books/{bookId}
router.delete("/:id", (req, res) => {
    /*Book.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) })
        .then(data => res.json(data))
        .catch(error => res.json(error));*/
    Book.findByIdAndRemove(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

/*router.delete("/remove", (req, res) => {
    Book.remove({ published: true })
        .then(data => res.json(data))
        .catch(error => res.json(error));
});*/

module.exports = router;
