const express = require("express");
const Posts = require("../data/db")

const router = express.Router()

router.get("/", (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json({ posts })
    }) .catch (error => {
        res.status(500).json({ message: error })
    })
})

module.exports = router