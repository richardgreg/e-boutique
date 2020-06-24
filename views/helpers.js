module.exports = {
  // Helper function for detecting and displaying errors
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
}
}