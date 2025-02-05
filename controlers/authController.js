const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const {
  createUser,
  getUserByEmail,
  getUserById,
} = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const sendCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hash = await argon2.hash(password);

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hash,
    };

    const createdUser = await createUser(newUser);

    const token = signToken(createdUser.id);

    sendCookie(res, token);

    createdUser.password = undefined;
    createdUser.id = undefined;

    res.status(201).json({
      status: 'success',
      data: createdUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if (!user) throw new AppError('User not found', 404);

    const token = signToken(user.id);

    sendCookie(res, token);

    user.password = undefined;
    user.id = undefined;

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) throw new AppError('Not logged in', 401);

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserById(id);

    if (!user) throw new AppError('User not found', 404);

    user.password = undefined;
    user.id = undefined;

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

exports.allowAccessTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();

    //  try {
    //   if (!roles.includes(req.user.role)) {
    //     throw new AppError('You do not have permission to perform this action', 403);
    //   }

    //   next();
    //  } catch (err) {
    //   next(err);
    //  }
  };
};

exports.authenticateUser = async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
  });

  res.status(200).json({ message: 'Logout successful' });
};
