const express = require("express");
const dotenv = require("dotenv");
const expressAsyncHandler = require("express-async-handler");
const { connect } = require("mongoose");
const { checkUserIsAuth } = require("../utils.js");
const User = require("../models/userModel.js");

const userRoute = express.Router();

dotenv.config();

connect(process.env.MONGODB_URL, {}).then(console.log("MongoDB Online!!!"));

userRoute.get("/validate-token", checkUserIsAuth, expressAsyncHandler(async (req, res) => {

  try {

    return res.status(202).json({ message: "User Validated." });

  } catch (err) {

    return res.status(500).json(err);

  }

}));

userRoute.get("/login", checkUserIsAuth, expressAsyncHandler(async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.user.email });

    if (user) {
      return res.status(202).json({
        success: true,
        message: "User Validated.",
        user: {
          name: user.name,
          picture: user.picture,
          token: req.headers.authorization.slice(7, req.headers.authorization.length),
        },
      });
    }

    const newUser = new User(req.body.user);

    newUser.save();

    return res.status(202).json({
      success: true,
      message: "User Created and Validated.",
      user: {
        name: newUser.name,
        picture: newUser.picture,
        token: req.headers.authorization.slice(7, req.headers.authorization.length),
      },
    });

  } catch (err) {
    return res.status(500).json(err);
  }

}));

module.exports = userRoute;
