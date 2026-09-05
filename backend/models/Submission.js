const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  feedback: { type: String },
  userCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userModified: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: 'dateModified' } });

module.exports = mongoose.model('Submission', submissionSchema);
