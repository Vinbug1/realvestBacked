const { Investment } = require("../models/investment");
const express = require("express");
const { User } = require("../models/user");
const { Item } = require("../models/item");
const { Interest } = require("../models/interest");
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
  if (req.query.users || req.query.items) {
    filter = { user: req.query.users.split(",") } || {
        item: req.query.items.split(","),
      } || {
        interest: req.query.interests.split(","),
      };
  }

  const investmentList = await Investment.find(filter)
    .populate("item")
    .populate("user")
    .populate("interest");

  if (!investmentList) {
    res.status(500).json({ success: false });
  }
  res.send(investmentList);
});

router.get(`/:id`, async (req, res) => {
  const investment = await Investment.findById(req.params.id)
    .populate("item")
    .populate("user")
    .populate("interest");

  if (!investment) {
    res.status(500).json({ success: false });
  }
  res.send(investment);
});

router.post(`/`, async (req, res) => {
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("Invalid User");

  const interest = await User.findById(req.body.interest);
  if (!interest) return res.status(400).send("Invalid Interest");
  // pending task inside this function
  //interest calculation
  //* create a new constant for interest
  //* create the mathematical formular for calculating the interest rate
  //interest calculation

  let investment = new Investment({
    name: req.body.name,
    description: req.body.description,
    intention_at: req.body.intention_at,
    payment_at: req.body.payment_at,
    confirm_at: req.body.confirm_at,
    request_close_at: req.body.request_close_at,
    close_at: req.body.close_at,
    amount_paid: req.body.amount_paid,
    investatus: req.body.investatus,
    user: req.body.user,
    item: req.body.item,
    interest: req.body.interest,
  });

  investment = await investment.save();

  if (!investment)
    return res.status(500).send("The investment cannot be created");

  res.send(investment);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Investment Id");
  }
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("Invalid Item");

  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("Invalid User");

  const interest = await User.findById(req.body.interest);
  if (!interest) return res.status(400).send("Invalid Interest");

  const investment = await Investment.findById(req.params.id);
  if (!investment) return res.status(400).send("Invalid Investment!");

  const updatedInvestment = await Investment.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      intention_at: req.body.intention_at,
      payment_at: req.body.payment_at,
      confirm_at: req.body.confirm_at,
      request_close_at: req.body.request_close_at,
      close_at: req.body.close_at,
      amount_paid: req.body.amount_paid,
      investatus: req.body.investatus,
      user: req.body.user,
      item: req.body.item,
      interest: req.body.interest,
    },
    { new: true }
  );

  if (!updatedInvestment)
    return res.status(500).send("the investment cannot be updated!");

  res.send(updatedInvestment);
});

router.delete("/:id", (req, res) => {
  Investment.findByIdAndRemove(req.params.id)
    .then((investment) => {
      if (investment) {
        return res.status(200).json({
          success: true,
          message: "the investment is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "investment not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// get user investment function
router.get(`/get/userinvestments/:id`, async (req, res) => {
  const userInvestmentList = await Investment.find({
    user: req.params.userid,
  })
    .populate({
      path: "items",
      populate: "category",
    })
    .populate("interest")
    .sort({ payment_at: -1 });
  if (!userInvestmentList) {
    res.status(500).json({ success: false });
  }
  res.send(userInvestmentList);
});

// router.get(`/get/count`, async (req, res) => {
//   const InvestmentCount = await Investment.countDocuments((count) => count);

//   if (!InvestmentCount) {
//     res.status(500).json({ success: false });
//   }
//   res.send({
//     InvestmentCount: InvestmentCount,
//   });
// });

// router.get(`/get/featured/:count`, async (req, res) => {
//   const count = req.params.count ? req.params.count : 0;
//   const products = await Product.find({ isFeatured: true }).limit(+count);

//   if (!products) {
//     res.status(500).json({ success: false });
//   }
//   res.send(products);
// });

// router.put(
//   "/gallery-images/:id",
//   uploadOptions.array("images", 10),
//   async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).send("Invalid Product Id");
//     }
//     const files = req.files;
//     let imagesPaths = [];
//     const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

//     if (files) {
//       files.map((file) => {
//         imagesPaths.push(`${basePath}${file.filename}`);
//       });
//     }

//     const investment = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         images: imagesPaths,
//       },
//       { new: true }
//     );

//     if (!investment) return res.status(500).send("the gallery cannot be updated!");

//     res.send(investment);
//   }
// );

module.exports = router;
