const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas");
const Campground = require("../models/Campgrounds");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }),
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "successfull made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const showCamp = await Campground.findById(req.params.id).populate(
      "reviews",
    );
    res.render("campgrounds/show", { showCamp });
  }),
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const findCamp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { findCamp });
  }),
);

router.put(
  "/:id/",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

router.delete(
  "/:id/",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds/");
  }),
);

module.exports = router;