import express from "express";
import reviewsModel from "./model.js";

import createHttpError from "http-errors";
const reviewsRouter = express.Router();

// POST

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new reviewsModel(req.body);
    const { _id } = await newReview.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// GET

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewsModel.find();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

// GET SPECIFIC

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const Review = await reviewsModel.findById(req.params.ReviewId);
    if (Review) {
      res.send(Review);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.ReviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// PUT

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await reviewsModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedReview) {
      res.send(updatedReview);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.ReviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const deletedReview = await reviewsModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (deletedReview) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.ReviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
