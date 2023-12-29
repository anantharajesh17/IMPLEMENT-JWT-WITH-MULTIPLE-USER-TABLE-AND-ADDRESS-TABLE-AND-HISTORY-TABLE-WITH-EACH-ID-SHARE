const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../common/model/userSchema');
const Admin = require('../../common/model/adminSchema');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log('Generated Secret Key:', secretKey);
const secretKey = process.env.secretKey;
let blacklistedTokens = [];
const generateToken = (data, userType) => {
  let payload = {};
  let model;
  switch (userType) {
    case 'user':
      payload = {
        id: data._id,
        // phone_number: userType.phone_numbe,
        // otp: userType.otp// Assuming your user model has an '_id' field
      };
      model = User;
      break;
    case 'admin':
      payload = {
        id: data._id,
        // email: userType.email,
        // password: userType.password // Assuming your admin model has an '_id' field
      };
      model = Admin;
      break;
    default:
      throw new Error('Invalid user type.');
  }
  const options = {
    expiresIn: '1h',
     // Token expiration time (optional)
  };
  return jwt.sign(payload, secretKey, options);
};
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
};
const isTokenBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};
const addTokenToBlacklist = (token) => {
      blacklistedTokens.push(token);
};
module.exports = {
  generateToken,
  verifyToken,
  isTokenBlacklisted,
  addTokenToBlacklist,
};


const Admin = require('../../common/model/adminSchema');
const { verifyToken } = require('./authMiddleware');
const apiResponse = require('../middleware/apiResponse');
const requireAdminAuth = async (req, res, next) => {
const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return apiResponse.unauthorizedResponse(res,'Unauthorized. Token not provided.' )
    }
    const decodedUser = verifyToken(token);
    if (decodedUser) {
        try {
            const { id } = decodedUser;
            const admin = await Admin.findById(id);
            if (!admin) {
                return apiResponse.validationError(res,'Unauthorized. Admin not found.' )
            }
            req.user = admin;
            next();
        } catch (err) {
            return apiResponse.serverErrorResponse(res,err.message);
        }
    } else {
        return apiResponse.unauthorizedResponse(res, 'Unauthorized. Invalid token or token has expired.' );
    }
};


module.exports = {requireAdminAuth}