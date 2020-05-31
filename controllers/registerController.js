const User = require('./../models/user')
const bcrypt = require('bcryptjs')

const { body, validationResult } = require('express-validator')

// Go to registration Form
exports.user_registration = (req, res) => {
  res.render('register', {
    title: 'Registration Form'
  })
}

// Create new user
exports.user_registration_post = [
  // validate fields
  body('name', 'Name must not be empty!').isLength({
    min: 3
  }).escape(),
  body('email', 'Email must be email and not be empty!').trim().isLength({
    min: 5
  }).escape(),
  body('password', 'Password must not be empty or less than 6!').trim().isLength({
    min: 6
  }),
  body('password2', 'Confirm Password must not be empty or less than 6!').trim().isLength({
    min: 6
  }),

  // Check if password and confirm password match
  (req, res, next) => {
    // if do not match, redirect to registration Form
    if (req.body.password !== req.body.password2) {
      const errors = []
      errors.push({ msg: 'Password do not match!' })
      res.render('register', {
        title: 'Registration Form',
        errors
      })
    }
    // if match, go to the next step
    next()
  },

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req)

    // if field is empty or less than limit given
    if (!errors.isEmpty()) {
      res.render('register', {
        title: 'Registration Form',
        errors: errors.array()
      })
    } else {
      // Data from form is valid, create new user with escaped and trimmed data
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        level: req.body.level
      })

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err)
          }
          // Set password to hashed
          user.password = hash
          // Save user
          user.save((err) => {
            if (err) {
              return next(err)
            }
            // Successful, redirect to login Form
            req.session.sessionFlash = {
              type: 'success',
              message: 'You\'re account has been created, please login'
            }
            res.redirect('/login')
          })
        })
      })
    }
  }
]