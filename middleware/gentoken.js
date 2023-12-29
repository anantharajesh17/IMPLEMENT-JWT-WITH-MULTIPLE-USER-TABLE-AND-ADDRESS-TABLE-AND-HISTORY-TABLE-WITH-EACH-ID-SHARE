const jwt = require('jsonwebtoken');
const secretKey = 'process.env.sk'; 
const controller = require('../controller/userController');
function generateToken(userId) {
  const payload = { userId };
  const token = jwt.sign(payload, secretKey, { expiresIn: '10h' }); 
  return token;
  console.log(token,"token");
}
const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, sk);
      return decoded;
      // console.log(decoded,'decoded');
    } catch (err) {
      return null;
    }
  }


// console.log(generateToken(userId))
module.exports ={generateToken, verifyToken};