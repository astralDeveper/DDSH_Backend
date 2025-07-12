const express = require("express");
const { createTag, getAllTags, getTagById, updateTag, deleteTag } = require("../controllers/TagController.js");

const router = express.Router();

router.post("/tag", createTag);
router.get("/tags", getAllTags);        // Get all tags
router.get("/tag/:id", getTagById);     // Get a single tag by ID
router.put("/tag/:id", updateTag);      // Update a tag by ID
router.delete("/tag/:id", deleteTag);   // Delete a tag by ID

module.exports = router;
