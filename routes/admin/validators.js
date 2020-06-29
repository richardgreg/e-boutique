const { check } = require("express-validator");
const userRepo = require("../../repositories/users");

// Validate objects
module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("Must be between 3 and 40 Characters"),

  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a number greater than one"),

  requireEmali: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already in use!");
      }
    }),

  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 to 20 characters"),

  requirePasswordComfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 to 20 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      } else {
        return true;
      }
    }),

  requireEmaliExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email) => {
      const user = await userRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found!");
      }
    }),

  requireValidPasswordForUser: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await userRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid Password");
      }

      const validPassword = await userRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error("Invalid Password");
      }
    }),
};
