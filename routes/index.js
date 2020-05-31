const express = require('express')
const router = express.Router()

// import auth
const { ensureAuthenticated, notAuthenticated } = require('./../config/auth')

// import controller
const registerController = require('../controllers/registerController')
const loginController = require('../controllers/loginController')

// Home Page
router.get('/', notAuthenticated, (req, res) => {
  res.render('index', {
    title: 'Welcome To The Website'
  })
})

// Admin Page
router.get('/admin', ensureAuthenticated, (req, res) => {
  // render if level is admin
  if (req.user.level === 'admin') {
    res.render('admin', {
      title: `Welcome ${req.user.level}`
    })
  }
  // redirect if level is not admin
  req.session.sessionFlash = {
    type: 'danger',
    message: 'You don\'t have access!'
  }
  res.redirect('/member')
})

// Member Page
router.get('/member', ensureAuthenticated, (req, res) => {
  // render if level is member
  if (req.user.level === 'member') {
    res.render('member', {
      title: `Welcome ${req.user.level}`
    })
  }
  // redirect if level is not member
  req.session.sessionFlash = {
    type: 'danger',
    message: 'You don\'t have access!'
  }
  res.redirect('/admin')
})

// GET request to Register Page
router.get('/register', notAuthenticated, registerController.user_registration)

// POST request for creating user
router.post('/register', registerController.user_registration_post)

// GET request to Login Page
router.get('/login', notAuthenticated, loginController.user_login)

// POST request for login user
router.post('/login', loginController.user_login_post)

// GET request to logout user
router.get('/logout', loginController.user_logout)

module.exports = router
