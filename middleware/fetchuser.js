var jwt = require("jsonwebtoken");
const JWT_SECRET = "iammaking@notes";
const fetchuser = (req, res, next) => {
  // get the user from the jwt token and append it to the request object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate with a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next(); // Call next to proceed to the next middleware or route handler.
  } catch (error) {
    res.status(401).send({ error: "please authenticate with a valid token" });
  }
};


module.exports = fetchuser;
