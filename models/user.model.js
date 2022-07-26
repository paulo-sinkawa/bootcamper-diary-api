const { Schema, model, Types, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  passwordHash: { type: String, required: true },
  age: { type: Number, required: true },
  img: {
    type: String,
    default:
      "https://res.cloudinary.com/paulosinkawa/image/upload/v1658955736/img-folder/file_dhmxgo.png",
  },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  isActive: { type: Boolean, default: true },
  disabledOn: { type: Date },
  carrerMigration: { type: Boolean },
  post: [{ type: Types.ObjectId, ref: "Post" }],
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
