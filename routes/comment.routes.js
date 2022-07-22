const router = require("express").Router();
const PostModel = require("../models/post.model");
const commentModel = require("../models/comment.model");

router.post("/create-comment", async (req, res) => {
  try {
    if (!req.body.post || req.body.post === []) {
      return res
        .status(400)
        .json({ message: "O comentário precisa ter um post" });
    }
    const createdComment = await commentModel.create({
      ...req.body,
      owner: req.currentUser._id,
      post: req.currentPost._id,
    });

    return res.status(201).json(createdComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/my-comment", async (req, res) => {
  try {
    const myComment = await ObsModel.findOne({ _id: commentId }).populate(
      "post"
    );
    return res.status(200).json(myComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.patch("edit/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const updtatedComment = await commentModel.findOneAndUpdate(
      { _id: commentId },
      { ...body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updtatedComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.delete("delete/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await CommentModel.deleteOne({
      _id: req.params.commentId,
    });
    return res.status(200).json.deletedComment;
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
