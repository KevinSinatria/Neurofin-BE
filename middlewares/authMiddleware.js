const Jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");

const authMiddleware = async (request, h) => {
  try {
    const token = request.state.token;
    if (!token) throw Boom.unauthorized("Token tidak ditemukan");

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    request.auth = decoded;

    return h.continue;
  } catch (err) {
    throw Boom.unauthorized("Token tidak valid atau kadaluarsa");
  }
};

module.exports = authMiddleware;
