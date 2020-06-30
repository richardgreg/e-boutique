const express = require("express");
const multer = require("multer");

const {handleErrors} = require("./middleware");
const ProductsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const {requireTitle, requirePrice} = require("./validators");

const router = express.Router();
// Middleware used in post request handler for image upload
const upload = multer({storage: multer.memoryStorage()});

router.get("/admin/products", (req, res) => {

});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    // Store buffer object in a base64 str format. Base64 can store images in
    // str format. Not recommended for production app
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await ProductsRepo.create({ title, price, image });

    res.send("Submitted");
  }
);

module.exports = router;