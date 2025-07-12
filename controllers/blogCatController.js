const Blog = require("../models/Blog");
const BlogCat = require("../models/BlogCat");

// Function to create a new project
const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const category = new BlogCat({
      name
    });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error saving category", error });
  }
};

// Function to get all projects
const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCat.findAll(); // Fetch all categories
    console.log(categories); // Log categories to debug
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error); // Log error for detailed debugging
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
};

// Function to get a single project by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await BlogCat.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving category", error: error.message });
  }
};

// Function to update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    
    const updatedCategory = await BlogCat.update(
      { name }, // The fields to update
      {
        where: { id }, // The condition to find the category by its ID
        returning: true, // Return the updated row
        plain: true, // Make sure the result is not wrapped in an array
      }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// Function to delete a project by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the blog
    await Blog.destroy({
      where: { categoryId: id }
    });
    const deletedCategory = await BlogCat.destroy({
      where: { id }
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
