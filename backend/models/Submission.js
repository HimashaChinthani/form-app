const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  mobileNumber: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  feedback: { type: String, trim: true },
  userCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userModified: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: 'dateModified' } });

module.exports = mongoose.model('Submission', submissionSchema);
