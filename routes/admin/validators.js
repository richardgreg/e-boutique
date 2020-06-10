const { check, validationResult } = require("express-validator");
const userRepo = require("../../repositories/users");

// Validate Email
module.exports = {
  requireEmali: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
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
      if (passwordConfirmation != req.body.password) {
        throw new Error("Passwords must match");
      }
    }),
};
