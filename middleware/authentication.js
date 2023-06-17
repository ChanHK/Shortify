import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return res
      .status(401)
      .json({
        tokenError: "No token or invalid token format, authorization denied",
      });

  try {
    const decoded = jwt.verify(token.substring(7), process.env.JWT_TOKEN_KEY);

    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).json({ tokenError: "Token is not valid" });
  }
}

export default auth;
