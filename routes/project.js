const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project");
const { isLoggedIn, isOwner } = require("../middleware");
const multer = require("multer");
const { cloudinary, storage } = require('../cloudinary');// Cloudinary configuration for file uploads
const upload = multer({ storage });

// Routes for Project Resource

// Index Route: Display all projects
router.get("/", projectController.index);

// New Project Route: Render form to create a new project
router.get("/new", isLoggedIn, projectController.renderNewForm);

// Create Project Route: Handle form submission to create a new project
router.post("/", isLoggedIn, upload.array("project[images]"), projectController.createProject);

// Show Project Route: Display details of a single project
router.get("/:id", projectController.showProject);

// Edit Project Route: Render form to edit an existing project
router.get("/:id/edit", isLoggedIn, isOwner, projectController.renderEditForm);

// Update Project Route: Handle form submission to update an existing project
router.patch(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.array("project[images]"),
    projectController.updateProject
);

// Delete Project Route: Delete a project
router.delete("/:id", isLoggedIn, isOwner, projectController.deleteProject);

module.exports = router;
