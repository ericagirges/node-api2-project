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

// POST a new post to posts
router.post("/", (req, res) => {
    db.insert(req.body)
    .then((post) => {
        if(!post.title || !post.contents) {
           res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) 
        } else {
            res.status(201).json(post);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

module.exports = router;
