// Import user model
const userModel = require('../models/userModel');

exports.adminPage = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role !== 'admin') return res.status(401).send('Unauthorized');

  userModel.getAllUsers((err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.render('admin', { users: results, user: req.session.user });
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      await userModel.deleteUserById(id);
      res.redirect('/admin');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
  }
};

