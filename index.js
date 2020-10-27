const express = require("express");
const server = express()
const postsRouter = require("./posts/posts-router")

server.use(express.json());
server.use("/api/posts", postsRouter)

server.get("/", (req, res) => {
    res.status(200).json({ api: "Welcome to the Lambda Posts API" })
})

server.listen(7575, () => {
    console.log("Server running on PORT 7575")
})