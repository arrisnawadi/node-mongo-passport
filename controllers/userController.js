const User = require('./../models/user')
const bcrypt = require('bcryptjs')

exports.change_password = [
  (req, res, next) => {
    // check current password
    bcrypt.compare(req.body.currPass, req.user.password, (err, result) => {
      if (err) { return next(err) }
      if (result == false) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Wrong current password!'
        }
        res.redirect(`/${req.user.level}`)
      }

      if (result == true) {
        // check new password and confirm new password
        if (req.body.newPass !== req.body.newPass2) {
          req.session.sessionFlash = {
            type: 'danger',
            message: 'New Password doesn\'t match!'
          }
          res.redirect(`/${req.user.level}`)
        } else {
          const userUpdate = new User({
            password: req.body.newPass,
            level: req.user.level,
            _id: req.user.id
          })

          // enrypt new password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userUpdate.password, salt, (err, hash) => {
              if (err) {
                return next(err)
              }
              // set password to hashed
              userUpdate.password = hash

              // update user
              User.findByIdAndUpdate(req.user.id, userUpdate, (err) => {
                if (err) {
                  return next(err)
                }
                // logout user after update password
                req.logout()
                req.session.sessionFlash = {
                  type: 'success',
                  message: 'You\'re password has changed, please login again'
                }
                res.redirect('/login')
              })
            })
          })
        }
      }
    })
  }
]