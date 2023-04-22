const { Transaction } = require("../models/transaction");
const express = require("express");
const { Investment } = require("../models/investment");
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
  if (req.query.investments) {
    filter = { investment: req.query.investment.split(",") };
  }

  const transactionList = await Transaction.find(filter).populate("investment");

  if (!transactionList) {
    res.status(500).json({ success: false });
  }
  res.send(transactionList);
});

router.get(`/:id`, async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate(
    "Investment"
  );

  if (!transaction) {
    res.status(500).json({ success: false });
  }
  res.send(transaction);
});

router.post(`/`, async (req, res) => {
  const investment = await Investment.findById(req.body.investment);
  if (!investment) return res.status(400).send("Invalid investment");

  let transaction = new Transaction({
    message: req.body.message,
    description: req.body.description,
    amount_paid: req.body.amount_paid,
    trxref: req.body.trxref,
    reference: req.body.reference,
    trans: req.body.trans,
    status: req.body.status,
    event: req.body.event,
    investment: req.body.investment,
  });

  transaction = await transaction.save();

  if (!transaction)
    return res.status(500).send("The transaction  record cannot be created");

  res.send(transaction);
});

router.put("/:id", async (req, res) => {
  const investment = await Investment.findById(req.body.investment);
  if (!investment) return res.status(400).send("Invalid investment");

  const transaction = await Investment.findById(req.params.id);
  if (!transaction) return res.status(400).send("Invalid transaction!");

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    {
      message: req.body.message,
      description: req.body.description,
      amount_paid: req.body.amount_paid,
      trxref: req.body.trxref,
      reference: req.body.reference,
      trans: req.body.trans,
      status: req.body.status,
      event: req.body.event,
      investment: req.body.investment,
    },
    { new: true }
  );

  if (!updatedTransaction)
    return res.status(500).send("the transaction record cannot be updated!");

  res.send(updatedTransaction);
});

router.delete("/:id", (req, res) => {
  Transaction.findByIdAndRemove(req.params.id)
    .then((transaction) => {
      if (transaction) {
        return res.status(200).json({
          success: true,
          message: "the transaction is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "transaction not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// router.get(`/get/count`, async (req, res) => {
//   const ItemCount = awaTransaction.countDocuments((count) => count);

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

//     const transaction = await Item.findByIdAndUpdate(
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
