const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const authenticateUser = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.PRIVATE_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    } else {
      throw new Error("Bearer token is missing");
    }
  } else {
    throw new Error("Authentication header is missing");
  }
};
module.exports = authenticateUser;
