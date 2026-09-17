import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Project slug/ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    titleKey: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
    },
    categoryKey: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      required: [true, 'Project short description is required'],
      trim: true,
    },
    descKey: {
      type: String,
      trim: true,
    },
    overview: {
      type: String,
      default: '',
    },
    overviewKey: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
      trim: true,
    },
    detailsLink: {
      type: String,
      default: '#',
      trim: true,
    },
    stack: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, 'At least one project image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A project must have at least one image',
      },
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in development
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
