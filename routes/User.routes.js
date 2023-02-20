const express = require("express");
const { Usermodel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existName = new Promise((resolve, reject) => {
      Usermodel.findOne({ name }, (err, user) => {
        if (err) return reject(new Error(err));
        if (user) return reject({ error: "User already exist, please login" });
        resolve();
      });
    });

    const existEmail = new Promise((resolve, reject) => {
      Usermodel.findOne({ email }, (err, email) => {
        if (err) reject(new Error(err));
        if (email) reject({ msg: "User already exist, please login" });
        resolve();
      });
    });

    Promise.all([existName, existEmail])
      .then(() => {
        if (password) {
          bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
              return res.status(500).send({ err });
            } else {
              const user = new Usermodel({ name, email, password: hash });
              await user.save();
              res.status(200).send({ msg: "User has been registered" });
            }
          });
        }
      })
      .catch((err) => {
        return res.status(500).send({ err });
      });
  } catch (err) {
    res.status(501).send({ error: "Cannot register User" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    Usermodel.findOne({ name }, (err, user) => {
      if (!user) res.status(404).send({ err: "name Not Found" });
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { userId: user._id },
              process.env.secret_key
            );
            return res
              .status(200)
              .send({ msg: "Login Successfull!", token: token });
          } else {
            return res.status(404).send({ err: "Password Did Not Match" });
          }
        });
      }
    });
  } catch (err) {
    return res.status(501).send({ err });
  }
});

module.exports = { userRouter };
