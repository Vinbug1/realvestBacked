const { Item } = require("../models/item");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const itemList = await Item.find(filter).populate("category");

  if (!itemList) {
    res.status(402).json({ success: false });
  }
  res.send(itemList);
});

router.get(`/:id`, async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");

  if (!item) {
    res.status(500).json({ success: false });
  }
  res.send(item);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let item = new Item({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    chasis: req.body.chasis,
    total_amount: req.body.total_amount,
    category: req.body.category,
    circle: req.body.circle,
    interest_rate: req.body.interest_rate,
  });

  item = await item.save();

  if (!item) return res.status(500).send("The item cannot be created");

  res.send(item);
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Item Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const item = await Item.findById(req.params.id);
  if (!item) return res.status(400).send("Invalid Item!");

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = item.image;
  }

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      chasis: req.body.chasis,
      total_amount: req.body.total_amount,
      category: req.body.category,
      circle: req.body.circle,
      interest_rate: req.body.interest_rate,
    },
    { new: true }
  );

  if (!updatedItem) return res.status(500).send("the item cannot be updated!");

  res.send(updatedItem);
});

router.delete("/:id", (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (item) {
        return res.status(200).json({
          success: true,
          message: "the item is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "item not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const ItemCount = await Item.countDocuments((count) => count);

  if (!ItemCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ItemCount: ItemCount,
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const Items = await Item.find({ isFeatured: true }).limit(+count);

  if (!Items) {
    res.status(500).json({ success: false });
  }
  res.send(Items);
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Item Id");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!item) return res.status(500).send("the gallery cannot be updated!");

    res.send(item);
  }
);

module.exports = router;
