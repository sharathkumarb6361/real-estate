const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isBcryptHash = (value) => (
  typeof value === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  passwordResetTokenHash: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  role: {
    type: String,
    enum: ['USER', 'AGENT', 'ADMIN'],
    default: 'USER'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  profile: {
    address: String,
    city: String,
    state: String,
    pincode: String
  }
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password') || isBcryptHash(this.password)) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
