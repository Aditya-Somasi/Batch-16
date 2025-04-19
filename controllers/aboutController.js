exports.renderAboutPage = (req, res) => {
  res.render('about', { user: req.user }); // <-- Pass the user here
};
