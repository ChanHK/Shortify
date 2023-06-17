import { Router } from "express";
import account from "../models/account.js";
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
// @access    Private
// Body       originalUrl to be shorten, customCode, expiration
// Response   shortCode
router.post("/shorten", authMiddleware, (req, res) => {
  const { errors, isValid } = validateShortenInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { originalUrl, customCode, expiration } = req.body;

  let shortCode = customCode || generateShortCode();

  // Check if customCode already exists in the database
  if (customCode) {
    urlCollection
      .findOne({ shortCode: customCode })
      .then((found) => {
        if (found) {
          // Replace customCode with a newly generated short code
          shortCode = generateShortCode();
        }

        createShortUrl(originalUrl, shortCode, expiration, req, res);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Failed to check custom code existence",
          error: err,
        });
      });
  } else {
    createShortUrl(originalUrl, shortCode, expiration, req, res);
  }
});

function createShortUrl(originalUrl, shortCode, expiration, req, res) {
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
      return res.status(200).json({ shortCode: shortCode });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Failed to create shortened URL", error: err });
    });
}

// @route     GET /shorten/:shortCode
// @desc      redirect originalUrl using shortCode
// @access    Public
// Param      shortCode
// Response   redirect to originalUrl
router.get("/shorten/:shortCode", (req, res) => {
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
// @access    Private
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

// @route     GET /shorten
// @desc      get all urlcolletion of an account
// @access    Private
// Response   urlcollections
router.get("/shorten", authMiddleware, (req, res) => {
  urlCollection
    .find({ accountId: req.user.id })
    .then((foundUrls) => {
      if (foundUrls.length === 0) {
        return res.status(404).json({
          message: "No URLs found for the account",
        });
      }

      const urls = foundUrls.map((url) => {
        const { originalUrl, shortCode, createdAt, expiration, clicks } = url;
        return {
          originalUrl,
          shortCode,
          createdAt,
          expiration,
          clicks,
        };
      });

      res.status(200).json(urls);
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error occurred while retrieving the URL details",
        error: err,
      });
    });
});

// @route     delete /account
// @desc      delete account and related urlcollection
// @access    Private
// Response   message
router.delete("/account", authMiddleware, (req, res) => {
  const accountId = req.user.id;

  urlCollection
    .deleteMany({ accountId: accountId })
    .then(() => {
      account
        .findByIdAndRemove(accountId)
        .then(() => {
          res.status(200).json({
            message:
              "Account and associated URL collections deleted successfully",
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Failed to delete account", error: err });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to delete URL collections", error: err });
    });
});

export default router;
