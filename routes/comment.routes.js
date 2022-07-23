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

router.patch(
  "/edit/:postId/:commentId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const updatedComment = await CommentModel.findOneAndUpdate(
        { _id: commentId },
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json(updatedComment);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

router.delete(
  "/delete/:commentId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const deletedComment = await CommentModel.deleteOne({
        _id: commentId,
      });
      return res.status(200).json(deletedComment);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
