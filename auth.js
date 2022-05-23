const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const nonSecurePaths = ['/api/users/login','/api/users/register', '/api/keys/check'];
  if (nonSecurePaths.includes(req.path)) return next();
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};