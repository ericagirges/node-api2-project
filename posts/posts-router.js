const express = require("express");
const Posts = require("../data/db");

const router = express.Router()

router.get("/", (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json({ posts })
    }) .catch (error => {
        res.status(500).json({ message: error })
    })
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json({ post })
        } else {
            res.status(404).json({ message: "Post not found." })
        }
    }) .catch (error => {
        console.log("ERROR: ", error)
        res.status(500).json({ message: "Error retrieving the post." })
    })
});

router.post("/", (req, res) => {
    Posts.insert({
        title: req.body.title,
        contents: req.body.contents
    })
    .then(post => {
        console.log("TITLE: ", post.title)
        console.log("CONTENTS: ", post.contents)
        if(!post.title || !post.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            res.status(201).json(post)
        }
    }) .catch(error => {
        console.log("ERROR: ", error)
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
});

router.put("/:id", (req, res) => {
    const changes = req.body
    Posts.update(req.params.id, changes)
    .then(post => {
        if(!post.title || !post.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else if(post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }) .catch(error => {
        console.log("ERROR: ", error)
        res.status(500).json({ error: "The post information could not be modified." })
    })
});

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
    .then(count => {
        if(count > 0){
            res.status(200).json({ message: 'The post has been successfully deleted.' });   
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }) .catch(error => {
        console.log("ERROR: ", error)
        res.status(500).json({ error: "The post could not be removed" })
    })
});

// GET post comments
router.get("/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if(!comments.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(comments)
        }
    }) .catch(error => {
        console.log("ERROR: ", error)
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
});

// POST a new comment to post
router.post("/:id/comments", (req, res) => {
    Posts.insertComment({
        text: req.body.text,
        post_id: req.params.id
    })
    .then(newComment => {
        if(!newComment.text){
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        } else {
            res.status(201).json(newComment)
        }
    }) .catch(error => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
});

module.exports = router