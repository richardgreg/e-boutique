const express = require("express");
const {check, validationResult} = require("express-validator");

const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmali,
  requirePassword,
  requirePasswordComfirmation
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
  async (req, res) => {
    // Pass information from request body to valdationResult
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({req, errors}));
    };

    // Get user repository from request body and see if it exists
    const { email, password, passwordConfirmation } = req.body;

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
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  // Get user info from request body
  const { email, password } = req.body;

  const user = await userRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }

  const validPassword = await userRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid Password");
  }

  req.session.userId = user.id;

  res.send("You are signed in");
});

module.exports = router;
