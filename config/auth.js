module.exports = {
  // Config when user has been authenticated
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.session.sessionFlash = {
      type: 'danger',
      message: 'You\'re must login!'
    }
    res.redirect('/login')
  },
  // Config when user has not authenticated
  notAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }
    return req.user.level === 'admin' ? res.redirect('/admin') : res.redirect('/member')
  }
}