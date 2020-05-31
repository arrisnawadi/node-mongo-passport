const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['admin', 'member'],
    default: 'member'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Virtual for user's URL
UserSchema.virtual('url').get(function () {
  return '/users/user/' + this._id
})

// Export model
module.exports = mongoose.model('User', UserSchema)