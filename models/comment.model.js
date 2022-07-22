const { Schema, Types, model } = require("mongoose");

const commentSchema = new Schema({
  post: { type: Types.ObjectId, ref: "Post" },
  user: { type: Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  creationDate: { type: Date, default: Date.now() },
});

const CommentModel = model("Comment", commentSchema);

module.exports = CommentModel;
