const express = require("express");

// import the router
const postsRouter = require("./posts/posts-router");

const server = express();
server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Blog Posts API is running...</h2>
    `);
});

const port = 6000;
server.listen(port, () => {
  console.log("\n*** Server Running on http://localhost:6000 ***\n");
});
