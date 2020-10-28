const express = require("express");
const postsRouter = require("./posts/posts-router")
const server = express()

server.use(express.json())
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
    res.status(200).json({ api: "Welcome to the Lambda Posts API" })
})

module.exports = server