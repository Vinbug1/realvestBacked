const { Interest } = require("../models/interest");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const interestList = await Interest.find();

  if (!interestList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(interestList);
});

router.get("/:id", async (req, res) => {
  const interest = await Interest.findById(req.params.id);

  if (!interest) {
    res.status(500).json({
      message: "The interest with the given Id was not found.",
    });
  }
  res.status(200).send(interest);
});

router.post("/", async (req, res) => {
  let interest = new Interest({
    amount_paid: req.body.amount_paid,
    instructed_at: req.body.instructed_at,
    paid_at: req.body.paid_at,
  });
  interest = await interest.save();

  if (!interest) return res.status(400).send("the interest cannot be created!");

  res.send(interest);
});

router.put("/:id", async (req, res) => {
  const interest = await Interest.findByIdAndUpdate(
    req.params.id,
    {
      amount_paid: req.body.amount_paid,
      instructed_at: req.body.instructed_at,
      paid_at: req.body.paid_at,
    },
    { new: true }
  );

  if (!interest) return res.status(400).send("the interest cannot be created!");

  res.send(interest);
});

router.delete("/:id", (req, res) => {
  Interest.findByIdAndRemove(req.params.id)
    .then((interest) => {
      if (interest) {
        return res.status(200).json({
          success: true,
          message: "the interest is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "interest not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
