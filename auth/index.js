const jwt = require("jsonwebtoken")
const KEY = "Real-Time Collaborative Document Editor"

module.exports.getToken = function (userData) {
    return jwt.sign(userData, KEY)
}

module.exports.verify = function (token) {
    try {
        return jwt.verify(token, KEY) ? true : false
    } catch (error) {
        return false
    }
}