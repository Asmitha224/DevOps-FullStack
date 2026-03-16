const User = require('../models/User');
const Paper = require('../models/Paper');

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.render('users/index', { title: 'User Management', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load users.');
    res.redirect('/dashboard');
  }
};

// GET /users/:id/edit
exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'User not found.');
    res.redirect('/users');
  }
};

// PUT /users/:id
exports.putEditUser = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(role)) {
      req.flash('error', 'Invalid role specified.');
      return res.redirect('/users');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    // Update session if admin changed their own role
    if (req.session.userId === req.params.id) {
      req.session.role = role;
    }

    req.flash('success', `User role updated to ${role} successfully.`);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update user role.');
    res.redirect('/users');
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.session.userId === req.params.id) {
      req.flash('error', 'You cannot delete your own account from user management.');
      return res.redirect('/users');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    // Delete user's papers
    const papers = await Paper.find({ uploadedBy: req.params.id });
    const fs = require('fs');
    const path = require('path');
    for (const paper of papers) {
      const filePath = path.join(__dirname, '../public/uploads', paper.pdfFile.filename);
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    await Paper.deleteMany({ uploadedBy: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    req.flash('success', 'User and their papers deleted successfully.');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete user.');
    res.redirect('/users');
  }
};
