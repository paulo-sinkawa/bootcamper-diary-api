const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");

const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        msg: "A senha precisa ter no mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e caractere especial.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "E-mail ou senha não conferem" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = generateToken(user);

      return res.status(200).json({
        token: token,
        user: { ...user._doc },
      });
    } else {
      return res.status(400).json({ msg: "E-mail ou senha não conferem" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/profile", isAuth, attachCurrentUser, (req, res) => {
  return res.status(200).json(req.currentUser);
});

router.patch("/update-profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { ...req.body },
      { runValidators: true, new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete(
  "/disable-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const disabledUser = await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { isActive: false, disabledOn: Date.now() },
        { runValidators: true, new: true }
      );

      delete disabledUser._doc.passwordHash;

      return res.status(200).json(disabledUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
