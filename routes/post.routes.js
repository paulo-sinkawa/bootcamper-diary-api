const router = require("express").Router();
const PostModel = require("../models/post.model");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");

router.post("/create", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    console.log(loggedInUser._id);
    const createdPost = await PostModel.create({
      ...req.body,
      owner: loggedInUser._id,
    });
    return res.status(201).json(createdPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/all-posts", async (req, res) => {
  try {
    const getAllPosts = await PostModel.find().populate("owner");
    return res.status(200).json(getAllPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get("/my-posts/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const foundPost = await PostModel.findOne({ _id: id })
      .populate("comment")
      .populate("owner");
    return res.status(200).json(foundPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.patch("/edit/:postId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const editedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(editedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.delete(
  "/delete/:postId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { postId } = req.params;
      const deletedPost = await PostModel.deleteOne({ _id: postId });

      return res.status(200).json(deletedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
