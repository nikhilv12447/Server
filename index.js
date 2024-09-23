const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidV4 } = require("uuid")
const cors = require("cors")
const bodyParser = require('body-parser')
const { setUser, getSingleUser } = require("./firebase/index")
const { getToken } = require("./auth")
const { verification } = require("./middleware/verification")
const axios = require("axios")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: "*" });
const connections = {}

app.use(cors())
app.use(bodyParser.json())
// app.use(express.json());
app.use("/user/*", verification)

app.post("/signup", (req, res) => {
    const { email, password } = req.body
    setUser(email, password).then((data) => {
        res.status(200).send({
            statusCode: 200,
            message: data
        })
    }).catch(() => {
        res.status(400).send({
            statusCode: 400,
            message: "Already Exist"
        })
    })
})

app.post("/login", (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    getSingleUser(email, password).then(user => {
        if (user) {
            res.status(200).send({
                statusCode: 200,
                token: getToken(user),
                message: "User has logged in."
            })
        } else {
            res.status(400).send({
                statusCode: 400,
                message: "User not exist"
            })
        }
    })
})

app.get("/user/verify", (req, res) => {
    res.status(200).send({
        statusCode: 200,
        isLogin: true
    })
})

app.get("/user/editor", (req, res) => {
    const editorId = uuidV4()
    const token = req.headers['x-token']
    connections[editorId] = [token]
    res.status(200).send({
        statusCode: 200,
        url: `/editor/${editorId}`
    })
})

app.post("/user/validateEditor", (req, res) => {
    const { editorId } = req.body
    if (connections[editorId]) {
        res.status(200).send({
            statusCode: 200,
            isValid: true
        })
    } else {
        res.status(400).send({
            statusCode: 400,
            isValid: false
        })
    }
})

io.on("connection", (socket) => {
    const { editorId } = socket.handshake.query
    socket.join(editorId)

    socket.on("update-text", (text) => {
        socket.to(editorId).emit("editor-text", text);
    })
});

httpServer.listen(8080);