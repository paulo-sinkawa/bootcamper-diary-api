const router = require("express").Router();
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");
const CommentModel = require("../models/comment.model");
const PostModel = require("../models/post.model");

router.post("/create/:postId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const createdComment = await CommentModel.create({
      ...req.body,
      post: postId,
    });

    const editedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comment: createdComment._id } },
      { new: true }
    );

    return res.status(201).json({ createdComment, editedPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/all-comments", async (req, res) => {
  try {
    const getAllComments = await CommentModel.find();
    return res.status(200).json(getAllComments);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get(
  "/my-comment/:postId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const myComment = await CommentModel.findOne({ _id: commentId });
      return res.status(200).json(myComment);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

router.patch("edit/:commentId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { commentId } = req.params;
    const updtatedComment = await CommentModel.findOneAndUpdate(
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
