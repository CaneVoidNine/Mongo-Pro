import express from "express";
import productModel from "./model.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import { mongo } from "mongoose";
const productsRouter = express.Router();

// POST

productsRouter.post("/", async (req, res, next) => {
  try {
    const newproduct = new productModel(req.body);
    const { _id } = await newproduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// GET

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await productModel.countDocuments(mongoQuery.criteria);
    console.log(total);
    const products = await productModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .sort(mongoQuery.options.sort)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit);
    res.status(200).send({
      links: mongoQuery.links(total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
    // const products = await productModel
    //   .find({})
    //   .populate({ path: "review", select: "comment rate" });
    // res.send(products);
  } catch (error) {
    next(error);
  }
});

// GET SPECIFIC

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await productModel
      .findById(req.params.productId)
      .populate({ path: "review", select: "comment rate" });

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// PUT

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedproduct = await productModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedproduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
