const { User } = require("../models");
const Bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/email");
const Jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");
async function generateId() {
  const { nanoid } = await import("nanoid");
  const id = nanoid(10);
  return id;
}

const registerHandler = async (request, h) => {
  const { username, email, password } = request.payload;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return h
        .response({
          status: "fail",
          message: "Email sudah terdaftar",
        })
        .code(400);
    }

    const hashedPassword = await Bcrypt.hash(password, 10);
    const verificationCode = await generateId();

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationCode,
    });

    try {
      await sendEmail(
        email,
        "Verifikasi Email Kamu - NeuroFin",
        `Halo! Terima kasih sudah mendaftar di NeuroFin. Kode verifikasi kamu adalah: ${verificationCode}`
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      return h
        .response({
          status: "fail",
          message: "Gagal mengirim email verifikasi",
        })
        .code(500);
    }

    return h
      .response({
        status: "success",
        message: "Registrasi berhasil, cek email untuk verifikasi",
      })
      .code(201);
  } catch (error) {
    console.error("Error during registration:", error.message);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const verifyEmailHandler = async (request, h) => {
  const { email, code } = request.payload;

  try {
    console.log("Email dari request:", email);
    console.log("Kode verifikasi dari request:", code);

    const user = await User.findOne({ where: { email } });
    console.log("Data pengguna dari database:", user);

    if (!user) {
      return h
        .response({
          status: "fail",
          message: "Email tidak ditemukan",
        })
        .code(404);
    }

    if (user.verificationCode !== code) {
      return h
        .response({
          status: "fail",
          message: "Kode verifikasi tidak valid",
        })
        .code(400);
    }

    user.verified = true;
    await user.save();

    return h
      .response({
        status: "success",
        message: "Email berhasil diverifikasi",
      })
      .code(200);
  } catch (error) {
    console.error("Error during email verification:", error.message);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const loginHandler = async (request, h) => {
  try {
    console.log('Incoming payload:', request.payload); // Debug 1
    
    if (!request.payload.email || !request.payload.password) {
      throw Boom.badRequest('Email dan password diperlukan');
    }

    const user = await User.findOne({ 
      where: { email: request.payload.email },
      attributes: ['id', 'email', 'password', 'verified'] // Explicit select
    });
    
    if (!user) {
      console.log('User not found for email:', request.payload.email);
      throw Boom.unauthorized('Email tidak terdaftar');
    }

    const valid = await Bcrypt.compare(request.payload.password, user.password);
    if (!valid) {
      throw Boom.unauthorized('Password salah');
    }

    if (!user.verified) {
      throw Boom.forbidden('Email belum diverifikasi');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined!');
      throw Boom.internal('Server misconfiguration');
    }

    const token = Jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '4h' }
    );

    return h.response({
      status: 'success',
      message: 'Login berhasil'
    })
    .code(200)
    .state('token', token, {
      ttl: 1000 * 60 * 60 * 4, // 4 jam
      path: '/',
      isSecure: true, // Wajib true di production
      isHttpOnly: true,
      sameSite: 'None', // Untuk cross-site
      domain: '.neurofin-be.vercel.app' // Sesuaikan
    });

  } catch (error) {
    console.error('Login error:', error);
    return h.response({
      status: 'error',
      message: error.message || 'Internal server error'
    }).code(error.output?.statusCode || 500);
  }
};

const meHandler = async (request, h) => {
  const user = await User.findByPk(request.auth.id, {
    attributes: ["id", "username", "email", "verified", "createdAt"],
  });
  return h
    .response({
      status: "success",
      message: "Berhasil mengakses data user",
      data: user,
    })
    .code(200);
};

const logoutHandler = async (request, h) => {
  return h
    .response({
      status: "success",
      message: "Logout berhasil",
    })
    .code(200)
    .unstate("token");
};

module.exports = {
  registerHandler,
  meHandler,
  verifyEmailHandler,
  loginHandler,
  logoutHandler,
};
