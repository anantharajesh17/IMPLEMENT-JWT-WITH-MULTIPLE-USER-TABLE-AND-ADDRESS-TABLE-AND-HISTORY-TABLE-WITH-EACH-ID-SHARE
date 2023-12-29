{
    "location":"home",
    "street":"ewrt",
    "city":"sdafs",
    "pincode":"ew",
    "address":"ewrt",
    "state":"ewrt",
    "country":"were",
    "flatno":"ewqrw",
    "houseno":"wqer",
    "buildno":"wewre"
}

{
    "email": "power1@example.com",
    "username": "power1",
    "password": "1231",
    "address": {
        "location": "home",
        "street": "ewrt",
        "city": "sdafs",
        "pincode": "ew",
        "address": "ewrt",
        "state": "ewrt",
        "country": "were",
        "flatno": "ewqrw",
        "houseno": "wqer",
        "buildno": "wewre"
    }
}


const createUserAndUpdateAddress = async (req, res) => {
  const { userId } = req.params; // userId is optional for updating user
  const { email, username, password, address, city, state, pincode } = req.body;

  try {
    let newUser, newAddress;

    // If userId is provided, update the existing user
    if (userId) {
      const existingUser = await UserTable.findByPk(userId);

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      await existingUser.update({
        email,
        username,
        password,
      });

      newUser = existingUser;
    } else {
      // Create a new user
      newUser = await UserTable.create({
        email,
        username,
        password,
      });
    }

    // Create a new address or update an existing address
    if (newUser) {
      if (newUser.addressId) {
        const existingAddress = await AddressTable.findByPk(newUser.addressId);

        if (existingAddress) {
          await existingAddress.update({
            address,
            city,
            state,
            pincode,
          });
          newAddress = existingAddress;
        }
      } else {
        newAddress = await AddressTable.create({
          address,
          city,
          state,
          pincode,
        });

        // Associate the new address with the user
        await newUser.update({ addressId: newAddress.id });
      }
    }

    res.status(200).json({ user: newUser, address: newAddress });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

module.exports = { createUserAndUpdateAddress };