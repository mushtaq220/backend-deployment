const express = require("express");
const { PostModel } = require("../models/Post.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postRouter = express.Router();

// Get Posts

postRouter.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const decode = jwt.verify(token, process.env.secret_key);
      if (decode) {
        const posts = await PostModel.find();
        res.status(201).send(posts);
      } else {
        res.status(500).send({ err: "Please Login First" });
      }
    } else {
      res.status(500).send({ err: "No Posts Available" });
    }
  } catch (err) {
    res.status(500).send({ err: "No Posts Available" });
  }
});

// Post
postRouter.post("/addposts", async (req, res) => {
  try {
    const payload = req.body;
    const posts = new PostModel(payload);
    await posts.save();
    res.status(201).send({ msg: "Post Created" });
  } catch (err) {
    res.status(500).send({ msg: "Please Login First" });
  }
});

// update posts
postRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const userId_making_req = req.body.user;

  try {
    const payload = req.body;

    const validate = await PostModel.findById(id);
    if (validate) {
      if (validate.user === userId_making_req) {
        await PostModel.findByIdAndUpdate({ _id: id }, payload);

        res.status(201).send({ msg: "Post has been updated" });
      } else {
        res
          .status(500)
          .send({ msg: "You are not Authorised To Update this post" });
      }
    } else {
      res.status(500).send({ msg: "cannot found post" });
    }
  } catch (err) {
    res.send(err);
  }
});

// Delete posts
postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
      await PostModel.findByIdAndDelete({ "_id": id })
      res.send(`Post with ${id} has been deleted`)
    }  catch (err) {
     res.send({"msg":"Something went wrong","error":err.message})
  }
});

module.exports = { postRouter };
