const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [200, 'Author cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Artificial Intelligence',
        'Machine Learning',
        'Data Science',
        'Computer Vision',
        'Natural Language Processing',
        'Cybersecurity',
        'Networking',
        'Software Engineering',
        'Database Systems',
        'Human-Computer Interaction',
        'Other',
      ],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
      maxlength: [5000, 'Abstract cannot exceed 5000 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    pdfFile: {
      filename: { type: String, required: true },
      originalname: { type: String, required: true },
      size: { type: Number, required: true },
      mimetype: { type: String, default: 'application/pdf' },
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text search index
paperSchema.index({ title: 'text', author: 'text', abstract: 'text' });

module.exports = mongoose.model('Paper', paperSchema);
