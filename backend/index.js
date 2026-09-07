const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/form_app';

const seedAdmin = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcrypt');
  try {
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ email: 'admin@test.com', password: hashedPassword, role: 'ADMIN', isSuperAdmin: true });
      console.log('Seeded initial admin: admin@test.com / admin123');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
