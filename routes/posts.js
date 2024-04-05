const mongoose = require("mongoose");
// const plm = require("passport-local-mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/pin");
const postSchema = new mongoose.Schema({
  image: String, 
  caption: String,
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
  },
});
// postSchema.plugin(plm);
module.exports = mongoose.model("posts", postSchema);
