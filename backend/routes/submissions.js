const express = require('express');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const router = express.Router();

// Form Submission (Customer Protected Route)
router.post('/', auth(['CUSTOMER']), async (req, res) => {
  try {
    const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;
    
    // Server side validations
    if (!firstName || !lastName || !email || !gender || !mobileNumber || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const mobileRegex = /^[0-9]{10}$/; // Simple local mobile format example
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(400).json({ message: 'Invalid local mobile number format' });
    }

    const newSubmission = new Submission({
      firstName, lastName, email, gender, mobileNumber, address, feedback,
      userCreated: req.user.id
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email must be unique per submission' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Admin Dashboard Routes (Admin Protected Routes)
router.get('/', auth(['ADMIN']), async (req, res) => {
  try {
    const { gender, search } = req.query;
    let query = {};
    
    if (gender) {
      query.gender = gender;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const submissions = await Submission.find(query).populate('userCreated', 'email').populate('userModified', 'email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Submission
router.put('/:id', auth(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, userModified: req.user.id };
    
    const updated = await Submission.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Submission
router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Submission.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Submission not found' });
    
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
