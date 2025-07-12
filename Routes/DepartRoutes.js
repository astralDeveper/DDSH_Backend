const express = require("express");
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController.js");

const router = express.Router();

router.post("/department", createDepartment);         // Create a new department
router.get("/departments", getAllDepartments);        // Get all departments
router.get("/department/:id", getDepartmentById);     // Get a single department by ID
router.put("/department/:id", updateDepartment);      // Update a department by ID
router.delete("/department/:id", deleteDepartment);   // Delete a department by ID

module.exports = router;