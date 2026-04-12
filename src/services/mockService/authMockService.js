const loginUser = ({ email, password }) => {
  if (!email || !password) return null;

  return {
    success: true,
    user: { id: "user-1", userName: "Test User", userEmail: email, address: [] },
    token: "fake-jwt-token",
  };
};

const registerUser = async ({ userName, userEmail, password, address }) => {
  return {
    success: true,
    user: { id: "user-1", userName, userEmail, address: address || [] },
  };
};

const getUserProfile = async (userId) => {
  return {
    success: true,
    user: { id: userId || "user-1", userName: "Test User", userEmail: "test@example.com", address: [] },
  };
};

const updateUserProfile = async (userId, updateData) => {
  return {
    success: true,
    user: { id: userId || "user-1", ...updateData },
  };
};

const addUserAddress = async (userId, address) => {
  return {
    success: true,
    user: { id: userId || "user-1", address: [address] },
  };
};

const updateUserPassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new Error("Old password and new password are required");
  }
  return {
    success: true,
    message: "Password updated successfully",
  };
};

const removeUserAddress = async (userId, index) => {
  return {
    success: true,
    user: { id: userId || "user-1", address: [] },
  };
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserPassword,
  removeUserAddress,
};