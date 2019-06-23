const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/", (req, res) => {
    res.send("Hello");
});

// POST /register
router.post("/register", (req, res) => {
    const {
      username,
      password
    } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        const user = new User({
            username,
            password: hash
        });

        user.save()
            .then(data => res.json(data))
            .catch(error => res.json(error));
    });
});

// POST /login
router.post("/login", (req, res) => {
    const {
        username,
        password
    } = req.body;

    User.findOne({
        username
    })
        .then(data => {
            if (!data) {
                res.json({
                    status: false,
                    message: "User not found!"
                });
            } else {
                bcrypt.compare(password, data.password, (err, result) => {
                    if (!result) {
                        res.json({
                            status: false,
                            message: "Wrong password!"
                        });
                    } else {
                        const payload = {
                            username
                        };
                        // JWT üret
                        const token = jwt.sign(payload, req.app.get("api_secret_key"), {
                            expiresIn: 3600
                        });

                        res.json({
                            status: true,
                            token
                        });
                    }
                });
            }
        })
        .catch(error => res.json(error));
});

module.exports = router;
