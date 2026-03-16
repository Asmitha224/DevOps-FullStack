const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/auth/logout');
    }
    res.render('profile/index', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load profile.');
    res.redirect('/dashboard');
  }
};

// PUT /profile
exports.putProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      req.flash('error', 'Name and email are required.');
      return res.redirect('/profile');
    }

    // Check email uniqueness (exclude current user)
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.session.userId },
    });
    if (existingUser) {
      req.flash('error', 'This email is already in use by another account.');
      return res.redirect('/profile');
    }

    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    };

    // Handle profile picture upload
    if (req.file) {
      const user = await User.findById(req.session.userId);
      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, '../public', user.profilePicture);
        try { fs.unlinkSync(oldPath); } catch (e) {}
      }
      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Update session
    req.session.userName = updatedUser.name;
    req.session.userEmail = updatedUser.email;
    if (updateData.profilePicture) {
      req.session.profilePicture = updateData.profilePicture;
    }

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update profile.');
    res.redirect('/profile');
  }
};

// PUT /profile/password
exports.putPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      req.flash('error', 'All password fields are required.');
      return res.redirect('/profile');
    }

    if (newPassword !== confirmNewPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }

    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/profile');
    }

    const user = await User.findById(req.session.userId);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }

    user.password = newPassword;
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to change password.');
    res.redirect('/profile');
  }
};
