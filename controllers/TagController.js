const Tag = require('../models/Tag');
const sequelize = require('../db');
const BlogTag = require('../models/BlogTag');


// Function to create a new project
 const createTag = async (req, res) => {
  const { name} = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create the new project
    const tag = new Tag({
      name
    });
    await tag.save();
    res.status(201).json({ message: "Tag created successfully", tag });
  } catch (error) {
    res.status(500).json({ message: "Error saving tag", error });
  }
};

// Function to get all projects
 const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tags", error });
  }
};

// Function to get a single project by ID
 const getTagById = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ tag });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tag", error });
  }
};

// Function to update a tag by ID
 const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    
    const updatedTag = await Tag.update(
  { name }, // Fields to update
  { 
    where: { id }, // Condition to find the tag by ID
    returning: true, // Ensures the updated record is returned
    plain: true, // Returns a single object instead of an array
  }
);
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating tag", error });
  }
};

// Function to delete a project by ID
 const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction
    const result = await sequelize.transaction(async (t) => {
      // Delete associated entries in BlogTag
      await BlogTag.destroy({
        where: { tagId: id }, // Assuming 'tagId' is the foreign key
        transaction: t, // Ensure this operation is part of the transaction
      });

      // Delete the tag itself
      const deletedRows = await Tag.destroy({
        where: { id },
        transaction: t,
      });
      if (!deletedRows) {
        throw new Error("Tag not found");
      }

      return deletedRows;
    });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tag", error:error.message });
  }
};
module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
};