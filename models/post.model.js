const { Schema, Types, model } = require("mongoose");

const postSchema = new Schema({
  owner: { type: Types.ObjectId, ref: "User" },
  date: { type: String },
  content: { type: String, required: true, maxLength: 200 },
  feeling: {
    type: String,
    enum: [
      "Orgulhoso",
      "Motivado",
      "Feliz",
      "Normal",
      "Preocupado",
      "Frustrado",
      "Desesperado",
    ],
  },
  creationDate: { type: Date, default: Date.now() },
  comment: [{ type: Types.ObjectId, ref: "Comment" }],
});

const PostModel = model("Post", postSchema);

module.exports = PostModel;
