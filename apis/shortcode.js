import { Router } from "express";
import urlCollection from "../models/urlCollection.js";
import authMiddleware from "../middleware/authentication.js";

import validateShortenInput from "./validations/shorten.js";

const router = Router();

function generateShortCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 6;
  let shortCode = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters.charAt(randomIndex);
  }

  return shortCode;
}

// @route     POST  /shorten
// @desc      POST  shorten url
// @access
// Body       originalUrl to be shorten, customCode, expiration
// Response   shortCode
router.post("/shorten", authMiddleware, (req, res) => {
  const { errors, isValid } = validateShortenInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { originalUrl, customCode, expiration } = req.body;

  const shortCode = customCode || generateShortCode();

  urlCollection
    .findOne({ originalUrl: originalUrl })
    .then((found) => {
      if (found) {
        return res.status(400).json({ message: "This URL already exists" });
      }

      const shortenUrl = {
        accountId: req.user.id,
        originalUrl: originalUrl,
        shortCode: shortCode,
        createdAt: new Date(),
        expiration: expiration,
      };

      urlCollection
        .create(shortenUrl)
        .then(() => {
          return res.status(200).json({
            shortCode: shortCode,
            message: `The shortened URL is http://localhost:5000/${shortCode}`,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: "Failed to create shortened URL", error: err });
        });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Failed to create shortened URL", error: err });
    });
});

// @route     GET /:shortCode
// @desc      redirect originalUrl using shortCode
// @access
// Param      shortCode
// Response   redirect to originalUrl
router.get("/:shortCode", authMiddleware, (req, res) => {
  const { shortCode } = req.params;
  urlCollection
    .findOne({ shortCode: shortCode })
    .then((found) => {
      if (!found) {
        return res.status(404).json({
          message: `URL for ${shortCode} does not exist in the database`,
        });
      }

      if (found.expiration && Date.now() > found.expiration.getTime()) {
        return res.status(400).json({
          message: "This shortened URL has expired",
        });
      }

      found.clicks++;
      found.save();

      res.redirect(found.originalUrl);
    })
    .catch((err) => {
      return res.status(500).json({
        message: "An error occurred while retrieving the URL",
        error: err,
      });
    });
});

// @route     delete /:shortCode
// @desc      delete urlCollection base on shortcode
// @access
// Param      shortCode
// Response   outcome messages
router.delete("/delete/:shortcode", authMiddleware, (req, res) => {
  const { shortcode } = req.params;

  urlCollection
    .findOneAndDelete({ shortCode: shortcode })
    .then((deletedUrl) => {
      if (!deletedUrl) {
        return res.status(404).json({
          message: `URL with shortcode ${shortcode} not found`,
        });
      }

      res.status(200).json({
        message: `URL with shortcode ${shortcode} has been deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error occurred while deleting the URL",
        error: err,
      });
    });
});

export default router;
