const Project = require("../models/project");
const Review = require("../models/review");

// Get all projects
module.exports.index = async (req, res) => {
    try {
        const projects = await Project.find({}).populate("owner").populate("reviews");
        res.render("projects/index", { projects });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching projects");
        res.redirect("/projects");
    }
};

// Show form to create new project
module.exports.renderNewForm = (req, res) => {
    res.render("projects/new");
};

// Create a new project
module.exports.createProject = async (req, res) => {
    try {
        const projectData = req.body.project;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            projectData.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        }

        // Create a new project and assign the owner
        const newProject = new Project(projectData);
        newProject.owner = req.user._id; // Assuming the user is authenticated

        await newProject.save();
        req.flash("success", "Project created successfully");
        res.redirect(`/projects/${newProject._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating project");
        res.redirect("/projects/new");
    }
};

// Show a specific project with owner's email
module.exports.showProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate("owner");

        if (!project) {
            req.flash("error", "Project not found");
            return res.redirect("/projects");
        }

        // Assuming owner has an email
        const ownerEmail = project.owner.email;

        res.render("projects/show", { project, ownerEmail });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching project details");
        res.redirect("/projects");
    }
};

// Show form to edit a project
module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        
        if (!project) {
            req.flash("error", "Project not found");
            return res.redirect("/projects");
        }

        res.render("projects/edit", { project });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error loading edit form");
        res.redirect(`/projects/${req.params.id}`);
    }
};

// Update a project
module.exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const projectData = req.body.project;

        // Update project data
        const project = await Project.findByIdAndUpdate(id, projectData, { new: true });

        // Handle new image uploads if any
        if (req.files && req.files.length > 0) {
            const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
            project.images.push(...imgs);
        }

        await project.save();
        req.flash("success", "Project updated successfully");
        res.redirect(`/projects/${project._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error updating project");
        res.redirect(`/projects/${req.params.id}/edit`);
    }
};

// Delete a project
module.exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        req.flash("success", "Project deleted successfully");
        res.redirect("/projects");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting project");
        res.redirect("/projects");
    }
};
