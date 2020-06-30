const { validationResult } = require("express-validator");

// Pass information from request body to valdationResult
module.exports = {
  handleErrors(templateFunc) {
    return (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send(templateFunc({ errors }));
      }
      // Callback funct that tells express all went well, so
      // call the next funct
      next()
    };
  }
};
