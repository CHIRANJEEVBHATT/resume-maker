import mongoose from "mongoose";

const { Schema, model } = mongoose;

const resumeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnailLink: {
    type: String,
  },
  template: {
    type: String,
  },
  colorPalette: [String],

  profileInfo: {
    profilePreviewUrl: String,
    fullName: String,
    designation: String,
    summary: String,
  },

  contactInfo: {
    email: String,
    phone: String,
    location: String,
    github: String,
    website: String,
  },


  workExperience: [
    {
      company: { type: String },
      position: { type: String },
      startDate: { type: Date }, 
      endDate: { type: Date }, 
      description: String,
    },
  ],

  education: [
    {
      institution: { type: String },
      degree: { type: String },
      startDate: Date,
      endDate: Date,
      grade: String,
    },
  ],


  projects: [
    {
      title: { type: String },
      description: String,
      technologies: [String],
      projectLink: String,
      githubLink: String,
    },
  ],

  //  Skills
  skills: [
    {
      name : String,
      progress : Number,
    },
  ],

  //Certifications
  certifications: [
    {
      name: { type: String, required: true },
      organization: String,
      issueDate: Date,
    },
  ],
language :[{
    name : String,
    progress : String
}],

interest : [String],

}, {
  timestamps: {createdAt : "createdAt" , updatedAt : "updatedAt"}
});

const Resume = mongoose.models.Resume || model("Resume", resumeSchema);

export default Resume;
