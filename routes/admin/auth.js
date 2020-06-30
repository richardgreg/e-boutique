const express = require("express");

const {handleErrors} = require("./middleware");
const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmali,
  requirePassword,
  requirePasswordComfirmation,
  requireEmaliExists,
  requireValidPasswordForUser
} = require("./validators");

// A sub-router for routing endpoints in-app
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({req}));
});

router.post(
  "/signup",
  [
    requireEmali,
    requirePassword,
    requirePasswordComfirmation,
  ],
  handleErrors(signupTemplate),
  async (req, res) => {
    // Get user repository from request body and see if it exists
    const { email, password } = req.body;

    // Create a user in our repo to represent the person
    const newUser = await userRepo.create({ email, password });

    // Store the id of that user inside the users cookie
    // Cookie session object added to req head by cookie-session library
    req.session.userId = newUser.id;

    res.send("Account created!!!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Logged out!!");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post("/signin",[
  requireEmaliExists,
  requireValidPasswordForUser
],
handleErrors(signinTemplate),
  async (req, res) => {
  // Get user info from request body
  const { email } = req.body;

  const user = await userRepo.getOneBy({ email });

  req.session.userId = user.id;

  res.send("You are signed in");
});

module.exports = router;
