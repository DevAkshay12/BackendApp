const jwt = require("jsonwebtoken");
const { connectDB } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "my_secure_secret_key";

const getUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({}).toArray();

    res.json({
      message: "List of users",
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({
      username,
      password
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        valid: false
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      valid: true
    });
  } catch (error) {
    console.error("Error validating user:", error.message);
    return res.status(500).json({
      message: "Failed to validate user",
      error: error.message
    });
  }
};

const validateUser = async (req, res) => {
  try {
    const { username, password } = req.query;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({
      username,
      password
    });

    if (user) {
      return res.json({
        message: "Login successful",
        valid: true,
        user
      });
    }

    return res.status(401).json({
      message: "Invalid username or password",
      valid: false
    });
  } catch (error) {
    console.error("Error validating user:", error.message);
    return res.status(500).json({
      message: "Failed to validate user",
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const db = await connectDB();
    const existingUser = await db.collection("users").findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    const result = await db.collection("users").insertOne({
      username,
      password
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({
      message: "Failed to create user",
      error: error.message
    });
  }
};

module.exports = { getUsers, loginUser, validateUser, createUser };
