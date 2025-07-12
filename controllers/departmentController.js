const Department = require("../models/Department.js");

// Function to create a new Department
const createDepartment = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const department = await Department.create({ name, email });
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error saving department", error: error.message });
  }
};

// Function to get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll(); // Fetch all departments using Sequelize
    res.status(200).json({ departments });
  } catch (error) {
    console.error(error); // Log error for detailed debugging
    res.status(500).json({ message: "Error retrieving departments", error: error.message });
  }
};

// Function to get a single project by ID
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Department", error });
  }
};

// Function to update a department by ID
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Find the department by ID
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update the department
    const updatedDepartment = await department.update({ name, email });

    res.status(200).json({ message: "Department updated successfully", updatedDepartment });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

// Function to delete a department by ID
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the department by ID and delete it
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Delete the department
    await department.destroy();

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
