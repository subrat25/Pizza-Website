const UserProfile = require("./models/userProfileModel");

const findUserByEmail = async (email) => {
  try {
    const user = await UserProfile.findOne({ userEmail: email });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

const createUser = async (userData) => {
  try {
    const { userName, userEmail, password, address } = userData;
    const newUser = await UserProfile.create({
      userName,
      userEmail,
      password,
      address: address || [],
    });
    return newUser;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("User already exists with this email");
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await UserProfile.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const user = await UserProfile.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
  updateUser,
};
