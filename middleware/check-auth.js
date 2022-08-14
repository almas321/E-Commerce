
    function checkAuthStatus(req, res, next) {
        const uid = req.session.uid;  //accessing userid from authentication.js

    if(!uid){  //if If a doesn't exist, which means the user did not log in before, return next();
     
        return next(); 
    
    }

  res.locals.uid = uid;
  res.locals.isAuth = true; 
  res.locals.isAdmin = req.session.isAdmin;
    next();        //important is that we call next so that the request can still travel on because not being authenticated does not mean that we want to crash the app or send you an error.
}

module.exports = checkAuthStatus;