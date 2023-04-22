const { Maintenance } = require("../models/maintenance");
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

  const maintenanceList = await Maintenance.find(filter).populate("items");

  if (!maintenanceList) {
    res.status(500).json({ success: false });
  }
  res.send(maintenanceList);
});

router.get(`/:id`, async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id).populate(
    "item"
  );

  if (!maintenance) {
    res.status(500).json({ success: false });
  }
  res.send(maintenance);
});

router.post(`/`, async (req, res) => {
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  let maintenance = new Maintenance({
    description: req.body.description,
    estimated_amount: req.body.estimated_amount,
    expended_amount: req.body.expended_amount,
    started_at: req.body.started_at,
    completed_at: req.body.completed_at,
    item: req.body.item,
  });

  maintenance = await maintenance.save();

  if (!maintenance)
    return res.status(500).send("The maintenance  record cannot be created");

  res.send(maintenance);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid maintenance Id");
  }
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  const maintenance = await Maintenance.findById(req.params.id);
  if (!maintenance) return res.status(400).send("Invalid maintenance!");

  const updatedMaintenance = await Maintenance.findByIdAndUpdate(
    req.params.id,
    {
      description: req.body.description,
      estimated_amount: req.body.estimated_amount,
      expended_amount: req.body.expended_amount,
      started_at: req.body.started_at,
      completed_at: req.body.completed_at,
      item: req.body.item,
    },
    { new: true }
  );

  if (!updatedMaintenance)
    return res.status(500).send("the maintenance record cannot be updated!");

  res.send(updatedMaintenance);
});

router.delete("/:id", (req, res) => {
  Maintenance.findByIdAndRemove(req.params.id)
    .then((maintenance) => {
      if (maintenance) {
        return res.status(200).json({
          success: true,
          message: "the maintenance is deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "this maintenance record was not  found!",
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
