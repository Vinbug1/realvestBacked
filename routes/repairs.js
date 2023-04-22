const { Repair } = require("../models/repair");
const express = require("express");
const { Item } = require("../models/item");
const router = express.Router();
const mongoose = require("mongoose");
// const multer = require("multer");

// const FILE_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const isValid = FILE_TYPE_MAP[file.mimetype];
//     let uploadError = new Error("invalid image type");

//     if (isValid) {
//       uploadError = null;
//     }
//     cb(uploadError, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     const fileName = file.originalname.split(" ").join("-");
//     const extension = FILE_TYPE_MAP[file.mimetype];
//     cb(null, `${fileName}-${Date.now()}.${extension}`);
//   },
// });

// const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.items) {
    filter = { item: req.query.item.split(",") };
  }

  const repairList = await Repair.find(filter).populate("items");

  if (!repairList) {
    res.status(500).json({ success: false });
  }
  res.send(repairList);
});

router.get(`/:id`, async (req, res) => {
  const repair = await Repair.findById(req.params.id).populate("item");

  if (!repair) {
    res.status(500).json({ success: false });
  }
  res.send(repair);
});

router.post(`/`, async (req, res) => {
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  let repair = new Repair({
    name: req.body.item.name,
    description: req.body.description,
    estimated_amount: req.body.estimated_amount,
    expended_amount: req.body.expended_amount,
    started_at: req.body.started_at,
    completed_at: req.body.completed_at,
    item: req.body.item,
  });

  repair = await repair.save();

  if (!repair)
    return res.status(500).send("The repair  record cannot be created");

  res.send(repair);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid maintenance Id");
  }
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  const repair = await Repair.findById(req.params.id);
  if (!repair) return res.status(400).send("Invalid repair!");

  const updatedRepair = await Repair.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      estimated_amount: req.body.estimated_amount,
      expended_amount: req.body.expended_amount,
      started_at: req.body.started_at,
      completed_at: req.body.completed_at,
      item: req.body.item,
    },
    { new: true }
  );

  if (!updatedRepair)
    return res.status(500).send("the repair record cannot be updated!");

  res.send(updatedRepair);
});

router.delete("/:id", (req, res) => {
  Repair.findByIdAndRemove(req.params.id)
    .then((repair) => {
      if (repair) {
        return res.status(200).json({
          success: true,
          message: "the repair is deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "this repair record was not  found!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// router.get(`/get/count`, async (req, res) => {
//   const ItemCount = await Item.countDocuments((count) => count);

//   if (!ItemCount) {
//     res.status(500).json({ success: false });
//   }
//   res.send({
//     ItemCount: ItemCount,
//   });
// });

// router.get(`/get/featured/:count`, async (req, res) => {
//   const count = req.params.count ? req.params.count : 0;
//   const Items = await Item.find({ isFeatured: true }).limit(+count);

//   if (!Items) {
//     res.status(500).json({ success: false });
//   }
//   res.send(Items);
// });

// router.put(
//   "/gallery-images/:id",
//   uploadOptions.array("images", 10),
//   async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).send("Invalid Item Id");
//     }
//     const files = req.files;
//     let imagesPaths = [];
//     const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

//     if (files) {
//       files.map((file) => {
//         imagesPaths.push(`${basePath}${file.filename}`);
//       });
//     }

//     const item = await Item.findByIdAndUpdate(
//       req.params.id,
//       {
//         images: imagesPaths,
//       },
//       { new: true }
//     );

//     if (!item) return res.status(500).send("the gallery cannot be updated!");

//     res.send(item);
//   }
// );

module.exports = router;
