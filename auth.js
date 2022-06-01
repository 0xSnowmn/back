const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const nonSecurePaths = ['/api/users/login','/api/users/register', '/api/keys/check','/api/updates/urge'];
  if (nonSecurePaths.includes(req.path)) return next();
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: err + '\n' + process.env.JWT + token
    });
  }
};
