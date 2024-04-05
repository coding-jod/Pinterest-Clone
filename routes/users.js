const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pin");
const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  password: String,
  email: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'posts'
    },
  ],
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);