const mysqlClient = require("./mysqlClient");

const findUserByEmail = async (email) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, user_name, user_email, password, address FROM user_profiles WHERE user_email = ?",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

const createUser = async (userData) => {
  try {
    const { userName, userEmail, password, address } = userData;
    const connection = mysqlClient.getConnection();

    const [checkRows] = await connection.query(
      "SELECT id FROM user_profiles WHERE user_email = ?",
      [userEmail]
    );

    if (checkRows.length > 0) {
      throw new Error("User already exists with this email");
    }

    const [result] = await connection.query(
      "INSERT INTO user_profiles (user_name, user_email, password, address, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [userName, userEmail, password, JSON.stringify(address || [])]
    );

    const insertedId = result.insertId;
    const user = {
      id: insertedId,
      user_name: userName,
      user_email: userEmail,
      address: address || [],
    };

    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, user_name, user_email, address FROM user_profiles WHERE id = ?",
      [userId]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const connection = mysqlClient.getConnection();
    const { userName, userEmail, password, address } = updateData;

    let query = "UPDATE user_profiles SET updated_at = NOW()";
    const values = [];

    if (userName) {
      query += ", user_name = ?";
      values.push(userName);
    }
    if (userEmail) {
      query += ", user_email = ?";
      values.push(userEmail);
    }
    if (password) {
      query += ", password = ?";
      values.push(password);
    }
    if (address) {
      query += ", address = ?";
      values.push(JSON.stringify(address));
    }

    query += " WHERE id = ?";
    values.push(userId);

    await connection.query(query, values);

    const [rows] = await connection.query(
      "SELECT id, user_name, user_email, address FROM user_profiles WHERE id = ?",
      [userId]
    );

    return rows[0] || null;
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
