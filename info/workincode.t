const AddressTable = require("../model/userAddress");
const UserTable = require("../model/userModel");
const bcrypt = require('bcrypt');

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

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while registering the user and creating the address.' });
  }
};
//update
const update = async (req, res) => {
  try {
    const {userId} = req.params;
    console.log(userId,"userID")
    const {
      email,
      username,
      password,
      address,
    } = req.body;
    const userToUpdate = await UserTable.findByIdAndUpdate(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }
    userToUpdate.username = username;
    userToUpdate.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 11);
      userToUpdate.password = hashedPassword;
    }
    if (userToUpdate.address_id) {
      
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
    }

    await userToUpdate.save();

    res.status(200).json({ message: 'User and address updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//history table
const historytable = async (req, res) => {
  try {
    const activeHistoryRecords = await HistoryAddress.find({ isActive: true })
      .populate('addressId')
      .populate('userId'); 

    res.status(200).json(activeHistoryRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = { register, update, historytable};