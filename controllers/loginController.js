const passport = require('passport')

// Go to login page
exports.user_login = (req, res) => {
  res.render('login', {
    title: 'Login'
  })
}

// Execute email and password to login
exports.user_login_post = [
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Wrong email or password!'
        }
        res.redirect('/login')
      }

      req.logIn(user, function (err) {
        if (err) { return next(err) }
        return user.level === 'admin' ? res.redirect('/admin') : res.redirect('/member')
      })
    })(req, res, next)
  }
]

// Execute user logout
exports.user_logout = (req, res) => {
  req.logout()
  req.session.sessionFlash = {
    type: 'success',
    message: 'You\'re logged out'
  }
  res.redirect('/login')
}