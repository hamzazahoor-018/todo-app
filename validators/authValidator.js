
const { body } = require("express-validator");

const signupValidation = [
  body("email")
    .isEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),

  body("role")
    .optional()
    .isIn(["teacher", "student"])
    .withMessage("Role must be teacher or student")
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

module.exports = {
  signupValidation,
  loginValidation
};