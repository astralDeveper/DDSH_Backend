const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getAllBlogsBack,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getAllBlogsUrl
} = require("../controllers/blogController.js");

const router = express.Router();

router.post("/blog", createBlog);           // Create a new blog
router.get("/blogs", getAllBlogs);          // Get all blogs
router.get("/blogs-url", getAllBlogsUrl);   // Get all blogs
router.get("/blogsall", getAllBlogsBack);   // Get all blogs
router.get("/blog/:id", getBlogById);       // Get a single blog by ID
router.get("/related-blogs/:id", getRelatedBlogs);  // Get related blogs
router.put("/blog/:id", updateBlog);        // Update a blog by ID
router.delete("/blog/:id", deleteBlog);     // Delete a blog by ID

module.exports = router;