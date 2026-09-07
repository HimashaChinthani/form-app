const express = require('express');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;

const validateSubmission = (data) => {
  const requiredFields = ['firstName', 'lastName', 'email', 'gender', 'mobileNumber', 'address'];
  if (requiredFields.some((field) => typeof data[field] !== 'string' || !data[field].trim())) {
    return 'All required fields must be provided';
  }
  if (!emailRegex.test(data.email.trim())) return 'Invalid email format';
  if (!mobileRegex.test(data.mobileNumber.trim())) return 'Invalid local mobile number format';
  if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) return 'Invalid gender';
  return null;
};

// Form Submission (Customer Protected Route)
router.post('/', auth(['CUSTOMER']), async (req, res) => {
  try {
    const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;
    
    // Server side validations
    const validationError = validateSubmission({ firstName, lastName, email, gender, mobileNumber, address });
    if (validationError) return res.status(400).json({ message: validationError });

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
    const editableFields = ['firstName', 'lastName', 'email', 'gender', 'mobileNumber', 'address', 'feedback'];
    const updateData = Object.fromEntries(
      editableFields.filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    const existing = await Submission.findById(id);
    if (!existing) return res.status(404).json({ message: 'Submission not found' });
    const validationError = validateSubmission({ ...existing.toObject(), ...updateData });
    if (validationError) return res.status(400).json({ message: validationError });
    updateData.userModified = req.user.id;
    
    const updated = await Submission.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    
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
