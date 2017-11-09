const auth = (req, res, next) => {
  if(!req.session.loggedIn) {
    res.redirect('/user/login');
  }
  next();
};

const loggedIn = (req, res, next) => {
  if(req.session.loggedIn) {
    res.redirect('/user/chatroom');
  }
  next();
};

module.exports = { auth, loggedIn };
