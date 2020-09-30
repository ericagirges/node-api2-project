const express = require("express");
const router = express.Router();
const db = require("../data/db");

// endpoints

// GET all posts
router.get("/", (req, res) => {
  db.find(req.query)
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET posts by id
router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// GET post comments by post id
router.get("/:id/comments", (req, res) => {
  db.findCommentById(req.params.id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// POST a new post to posts
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
    return;
  }
  db.insert(req.body)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const comment = req.body; // comment data
  const findPost = db.findById(req.params.id);
  if (!findPost) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (comment.text) {
    db.insertComment({
      post_id: req.params.id,
      ...comment,
    })
      .then((result) => {
        res.status(201).json({ result });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then((post) => {
      if (post > 0) {
        res.status(200).json({ message: "This post has been deleted." });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

// PUT
router.put("/:id", (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified.",
      });
    });
});

module.exports = router;
