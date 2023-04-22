const { Post } = require("../models/post");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const postList = await Post.find();

  if (!postList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(postList);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(500).json({
      message: "The post with the given Id was not found.",
    });
  }
  res.status(200).send(post);
});

router.post("/", async (req, res) => {
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });
  post = await post.save();

  if (!post) return res.status(400).send("the post cannot be created!");

  res.send(post);
});

router.put("/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    },
    { new: true }
  );

  if (!post) return res.status(400).send("the post cannot be created!");

  res.send(post);
});

router.delete("/:id", (req, res) => {
  Post.findByIdAndRemove(req.params.id)
    .then((post) => {
      if (post) {
        return res.status(200).json({
          success: true,
          message: "the post is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "post not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
