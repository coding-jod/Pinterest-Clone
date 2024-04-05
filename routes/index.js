var express = require("express");
var router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("./users");
const postModel = require("./posts");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});
router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await req.user.populate("posts");
  res.render("profile", { user: req.user });
});
router.get("/show",isLoggedIn,async function(req,res){
const user= await req.user.populate("posts");
res.render("show",{user});
});
router.get("/feed", async function (req, res) {
  const allUsers = await userModel.find();
  // Populate posts for each user asynchronously
  for (const user of allUsers) {
    await user.populate("posts");
  }
  res.render("feed", { allUsers }); // Render the 'feed' view and pass the fetched data to the template
});
router.post("/upload", upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  // res.send("File uplaoded successfully");
  user = req.user;
  const post = await postModel.create({
    image: req.file.filename,
    caption: req.body.imageCaption,
    user: user._id,
  });
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});
router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
  });
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
