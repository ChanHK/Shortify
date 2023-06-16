import { Router } from "express";
import urlCollection from "./models/urlCollection.js";

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

// @route     POST  api/shorten
// @desc      POST  shorten url
// @access
// Body       originalUrl to be shorten, customCode, expiration
// Response   shortCode
router.post("/shorten", (req, res) => {
  const { originalUrl, customCode, expiration } = req.body;

  const shortCode = customCode || generateShortCode();

  urlCollection
    .findOne({ originalUrl: originalUrl })
    .then((found) => {
      if (found) {
        return res.status(400).json({ message: "This URL already exists" });
      }

      const shortenUrl = {
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
            message: `The shortened URL is http://localhost/${shortCode}`,
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

// @route     GET api/:shortCode
// @desc      GET originalUrl using shortCode
// @access
// Body       shortCode
// Response   originalUrl
// router.get("/:shortCode", (req, res) => {});

export default router;
