const User = require('../models/User');
const Role = require('../models/Role');
const Module = require('../models/Module');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');


 const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  // Input Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: 1,
    });

    // Send response
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || "Something went wrong",
    });
  }
};

 const Login = async (req, res) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    // Correctly use the 'where' clause to find the user by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'roleDetails',  // Use the alias defined in the User model association
          include: {
            model: Module,  // Populate modules associated with the role
            as: 'modules',  // Ensure the alias matches the 'as' defined in the Role model
          }
        }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    const isPasswordValid=bcrypt.compare(password, user.password).then((result) => {  
}).catch((err) => {
  console.error("Error:", err);
});
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    // Get the role and modules
    const roles = user.roleDetails ? user.roleDetails.name : 'No role';
    const userModules = user.roleDetails ? user.roleDetails.modules : [];
    const modules = userModules.map(module => module.name);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, roles, modules },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};

 const getAllusers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: 'roleDetails',
          required: false, // Perform a LEFT JOIN to include users with no matching roles
        },
      ],
      where: {
        [Op.or]: [
          { '$roleDetails.name$': { [Op.notIn]: ['superadmin'] } }, // Exclude specific roles
          { '$roleDetails.id$': null },  // Include users with no matching roles
        ],
      },
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error(error); // Log error for detailed debugging
    res.status(500).json({ message: "Error retrieving users", error:error.message });
  }
};
module.exports = {
  signUp,
  Login,
  getAllusers,
};