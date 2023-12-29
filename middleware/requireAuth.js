// const verifyToken  = require('../middleware/gentoken');
// const UserTable = require('../model/userModel');
// const requireAuth = async (req, res, next) => {
// const token = req.headers.authorization?.replace('Bearer ', '');
//     if (!token) {
//         res.status(401).json({message:'token is missing'})
//     }
//     const decodedUser = verifyToken(token);
//     if (decodedUser) {
//         try {
//             const { id } = decodedUser;
//             console.log(decodedUser);
//             const admin = await user.findById(id);
//             if (!admin) {
//                 return console.log("admin",admin)
//             }
//             req.user = admin;
//             next();
//         } catch (err) {
//             return console.log("error")
//         }
//     } else {
//         return console.log('Unauthorized. Invalid token or token has expired.' );
//     }
// };

 

// const requireAuth = async (req, res, next) => {
  
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     console.log(token,"token");
//     if (!token) {
//       return res.status(401).json({ message: 'Token is missing' });
//     }
//         console.log("001");
//     // Verify
    // const verifyToken = (token) => {
  // try {
  //   const decoded = jwt.verify(token, secretKey);
  //   return decoded;
  //   console.log(decoded,'decoded');
  // } catch (err) {
  //   return null;
  // }
//     const decoded = jwt.verify(token, secretKey);
//      console.log(decoded,"kjh");
//      console.log("002");
//     const user = await UserTable.findById(decoded.userId);
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }  
//     req.user = user;
//     console.log(req.user);
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({ message: 'Unauthzzorized. Invalid token or token has expired.' });
//     // console.log(err);
//   }
// };

// require('dotenv')
// const jwt = require('jsonwebtoken');
// 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const requireAuth = async (req, res, next) => {
  const sk = process.env.sk;
    const token = req.headers.authorization.split(' ')[1]; 
    // console.log(token,"....hello ....tokens ");
    if (!token) {
      res.status(404).json({message:'Authentication failed!'});
    }
    // console.log("hello");
    // console.log(sk);
    const decoded = jwt.decode(token, sk);
    // console.log(decoded);
    req.user = decoded;
    next()
  //  console.log(req.user,"iuyt")
};

module.exports = requireAuth;