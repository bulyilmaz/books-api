const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.body.token || req.query.token;

    if (!token) {
        return next({
            status: false,
            message: "No token provided."
        });
    } else {
        jwt.verify(token, req.app.get("api_secret_key"), (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    message: "Wrong token!"
                });
            } else {
                req.data = data;
                next();
            }
        });
    }
};