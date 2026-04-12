const pgClient = require("./pgClient");

const findUserByEmail = async (email) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT id, user_name, user_email, password, address FROM user_profiles WHERE user_email = $1",
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

const createUser = async (userData) => {
  try {
    const { userName, userEmail, password, address } = userData;
    const client = pgClient.getClient();

    const checkResult = await client.query(
      "SELECT id FROM user_profiles WHERE user_email = $1",
      [userEmail]
    );

    if (checkResult.rows.length > 0) {
      throw new Error("User already exists with this email");
    }

    const result = await client.query(
      "INSERT INTO user_profiles (user_name, user_email, password, address, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, user_name, user_email, address",
      [userName, userEmail, password, JSON.stringify(address || [])]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT id, user_name, user_email, address FROM user_profiles WHERE id = $1",
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const client = pgClient.getClient();
    const { userName, userEmail, password, address } = updateData;

    const result = await client.query(
      "UPDATE user_profiles SET user_name = COALESCE($1, user_name), user_email = COALESCE($2, user_email), password = COALESCE($3, password), address = COALESCE($4, address), updated_at = NOW() WHERE id = $5 RETURNING id, user_name, user_email, address",
      [userName || null, userEmail || null, password || null, address ? JSON.stringify(address) : null, userId]
    );

    return result.rows[0] || null;
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
