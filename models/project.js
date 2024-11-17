const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    status: {
        type: String,
        enum: ["Working", "Completed"],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        select: 'email', // This will include the `email` field of the owner
        required: true
    },
    githubLink: {
        type: String,
        required: true
    },
    hostedLink: {
        type: String,
        required: true
    }
});

// Mongoose middleware to handle the automatic removal of associated reviews when a project is deleted
projectSchema.post("findOneAndDelete", async (project) => {
    if (project) {
        // Optionally delete reviews associated with this project if you decide to delete them manually
        // The reviews are now separate, so this part is no longer required if reviews are managed independently
    }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
