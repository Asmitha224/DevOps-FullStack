const Paper = require('../models/Paper');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
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
];

// GET /papers
exports.getAllPapers = async (req, res) => {
  try {
    const { search, category, year, sort = 'newest', page = 1 } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (year) query.year = parseInt(year);

    let sortOption = {};
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'year') sortOption = { year: -1 };

    const totalPapers = await Paper.countDocuments(query);
    const papers = await Paper.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPapers / limit);

    res.render('papers/index', {
      title: 'Research Papers',
      papers,
      categories: CATEGORIES,
      currentSearch: search || '',
      currentCategory: category || '',
      currentYear: year || '',
      currentSort: sort,
      currentPage: parseInt(page),
      totalPages,
      totalPapers,
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load papers.');
    res.redirect('/dashboard');
  }
};

// GET /papers/create
exports.getCreatePaper = (req, res) => {
  res.render('papers/create', {
    title: 'Upload Paper',
    categories: CATEGORIES,
    currentYear: new Date().getFullYear(),
  });
};

// POST /papers
exports.postCreatePaper = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please upload a PDF file.');
      return res.redirect('/papers/create');
    }

    const { title, author, category, abstract, year } = req.body;

    if (!title || !author || !category || !abstract || !year) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      req.flash('error', 'All fields are required.');
      return res.redirect('/papers/create');
    }

    const paper = await Paper.create({
      title: title.trim(),
      author: author.trim(),
      category,
      abstract: abstract.trim(),
      year: parseInt(year),
      pdfFile: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      uploadedBy: req.session.userId,
    });

    // Update user paper count
    await User.findByIdAndUpdate(req.session.userId, { $inc: { papersUploaded: 1 } });

    req.flash('success', 'Research paper uploaded successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    req.flash('error', 'Failed to upload paper. Please try again.');
    res.redirect('/papers/create');
  }
};

// GET /papers/:id
exports.getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    res.render('papers/show', { title: paper.title, paper });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Paper not found.');
    res.redirect('/papers');
  }
};

// GET /papers/:id/edit
exports.getEditPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    // Only uploader or admin can edit
    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You are not authorized to edit this paper.');
      return res.redirect('/papers');
    }

    res.render('papers/edit', {
      title: 'Edit Paper',
      paper,
      categories: CATEGORIES,
      currentYear: new Date().getFullYear(),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Paper not found.');
    res.redirect('/papers');
  }
};

// PUT /papers/:id
exports.putEditPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You are not authorized to edit this paper.');
      return res.redirect('/papers');
    }

    const { title, author, category, abstract, year } = req.body;

    paper.title = title.trim();
    paper.author = author.trim();
    paper.category = category;
    paper.abstract = abstract.trim();
    paper.year = parseInt(year);

    // If new PDF uploaded
    if (req.file) {
      const oldPath = path.join(__dirname, '../public/uploads', paper.pdfFile.filename);
      try { fs.unlinkSync(oldPath); } catch (e) {}
      paper.pdfFile = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };
    }

    await paper.save();

    req.flash('success', 'Paper updated successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update paper.');
    res.redirect(`/papers/${req.params.id}/edit`);
  }
};

// DELETE /papers/:id
exports.deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You are not authorized to delete this paper.');
      return res.redirect('/papers');
    }

    // Delete PDF file
    const filePath = path.join(__dirname, '../public/uploads', paper.pdfFile.filename);
    try { fs.unlinkSync(filePath); } catch (e) {}

    await Paper.findByIdAndDelete(req.params.id);

    // Decrement user paper count
    await User.findByIdAndUpdate(paper.uploadedBy, { $inc: { papersUploaded: -1 } });

    req.flash('success', 'Paper deleted successfully.');
    res.redirect('/papers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete paper.');
    res.redirect('/papers');
  }
};
