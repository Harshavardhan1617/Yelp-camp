module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must be Signed in first");
    return res.redirect("/login");
  }
  res.redirect("/new");
};
