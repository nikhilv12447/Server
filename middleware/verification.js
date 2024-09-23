
const { verify } = require("../auth")
module.exports.verification = (req, res, next) => {
    const token = req.headers['x-token']
    if (verify(token)) {
        next()
    } else {
        res.status(400).send({
            statusCode: 400,
            message: "User not exist"
        })
    }
}