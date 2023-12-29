const UserModel = require("../model/userModel")
const Address = require('../model/userAddress');

const bcrypt = require('bcrypt');

//register means post
const register = async (req, res) => {
    const { username, email, password } = req.body;
    if ( !username || !email || !password) {
        res.status(400).json({message:"All fields are mandatory!"});
      }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const User = new UserModel({ username, email, password: hashedPassword,isactive:true});  
    await User.save()
      .then((data) => {
        res.send({
          message: "User created successfully!!",
          user: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating user",
        });
      });

    const {location,address,city,state,country,street,pincode,flatno,houseno,buildno} = req.body
    if ( !location || !address || !city || !state ||! country ||!street ||!pincode ||!flatno ||!houseno ||!buildno) {
      res.status(400).json({message:"All fields are mandatory!"});
    }
    
  };

  const update = async (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password) {
        res.status(400).json({message:"All fields are mandatory!"});
      }
    try {
      const { id: userID } = req.params;
      const user = await UserModel.findOneAndUpdate({ email,password });
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
    }
  };


  module.exports={register,update}