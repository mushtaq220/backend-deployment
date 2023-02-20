const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  device: String,
  no_of_comments: Number,
  user: String,
});

const PostModel = mongoose.model("post", postSchema);

module.exports = { PostModel };