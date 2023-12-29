const AddressTable = require("../model/userAddress");
const UserTable = require("../model/userModel");
const HistoryAdd = require("../model/historyAddress");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const requireAuth = require("../middleware/requireAuth");
const {generateToken} = require("../middleware/gentoken");
// const validateToken = require("../middleware/validatetoken");
const mongoose = require("mongoose")
const register = async (req, res) => {
  try {
    const { email, username, password, address } = req.body;

    const newAddress = await AddressTable.create({
      location: address.location,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      street: address.street,
      pincode: address.pincode, 
      flatno: address.flatno,
      houseno: address.houseno,
      buildno: address.buildno
    });
    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = await UserTable.create({
      email,
      username,
      password: hashedPassword,
      address_id: newAddress._id,
    });
    // const token = generateToken(userId);
    res.status(201).json(newUser);
    const his = await HistoryAdd.create({
      user_id: newUser._id, 
      address_id: newAddress._id, 
      createdAt:Date.now(),
      updatedAt:Date.now(),
      isActive:false
    })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while registering the user and creating the address.' });
  }
};

//login method;
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are mandatory!' });
  }
  const user = await UserTable.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email or password is not valid' });
  }
  if (!user.isActive === true) {
    return res.status(401).json({ message: 'User is not active' });
  }
  const token = generateToken(user._id);
  res.status(200).json({ token });
};

//update
const update = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "userID");
    const {
      email,
      username,
      password,
      address,
    } = req.body;

    const userToUpdate = await UserTable.findById(userId);////////75th line

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    userToUpdate.username = username;
    userToUpdate.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 11);
      userToUpdate.password = hashedPassword;
    }

    // console.log('userToUpdate.address_id:', userToUpdate.address_id); 

    if (userToUpdate.address_id && mongoose.Types.ObjectId.isValid(userToUpdate.address_id)) {
      // Update the existing address
      const updatedAddress = await AddressTable.findByIdAndUpdate(
        userToUpdate.address_id,
        {
          location: address.location,
          address: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
          street: address.street,
          pincode: address.pincode,
          flatno: address.flatno,
          houseno: address.houseno,
          buildno: address.buildno,
        },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
    } else {
      // Create a new address if one doesn't exist
      const newAddress = await AddressTable.create({
        location: address.location,
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        street: address.street,
        pincode: address.pincode,
        flatno: address.flatno,
        houseno: address.houseno,
        buildno: address.buildno,
      });

      userToUpdate.address_id = newAddress._id;
      await userToUpdate.save();
    }

    res.status(200).json({ message: 'User and address updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//history table
const historytable = async (req, res) => {
  try {
    const activeHistoryRecords = await HistoryAdd.find({ isActive: false })
      // .populate('addressId')
      // .populate('userId'); 

    res.status(200).json(activeHistoryRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const findone = async (req, res) => {
  const userId = req.user.userId;
    // console.log(userId,"kkj");
  try {
    if (!userId) {
      res.status(401).json({ message: 'Token not provided or invalid' });
    }
    const user = await UserTable.findById(userId).populate('address_id');
    if (!userId) {
      res.status(404).json({ message: 'User not found' });
    }
    const userAddresses = user.address_id;
    if (!userAddresses || userAddresses.length === 0) {
      res.status(404).json({ message: 'User has no addresses' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//histoty table
const getAddressByToken = async (req, res) => {
  // const token = req.headers.authorization; 
  const userId = req.user.userId;

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // const decodedToken = jwt.verify(token, process.env.sk);
    // const userId = decodedToken.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const userAddress = await HistoryAdd.findOne({ user_id: userId, isActive: true });

    if (!userAddress) {
      return res.status(404).json({ message: 'User address not found' });
    }
    res.status(200).json({ address: userAddress.address });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { 
  register, 
  update, 
  historytable, 
  login, 
  findone, 
  requireAuth,
   getAddressByToken
  };