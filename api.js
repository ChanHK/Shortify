import { Router } from "express";
const router = Router();

// @route     POST  api/shorten
// @desc      POST  shorten url
// @access
// Body       originalUrl to be shorten, isCustom, customCode
// Response   originalUrl, shortUrl, createdAt, expiration
router.post("/shorten", (req, res) => {});

// @route     GET api/:shortCode
// @desc      GET originalUrl using shortCode
// @access
// Body       shortCode
// Response   originalUrl
router.get("/:shortCode", (req, res) => {});

export default router;