function addCsrftoken(req,res,next){
    //I'll use a feature supported by express, which allows me to set variables that are exposed to all views automatically with help of the locals property. And on locals, I can then add my own key value pairs like token and the value of that custom property on locals will be request dot CSRF token, which is a method I call. This method is available thanks to the CSRF middleware package

    //So this generates a valid token. This token is then saved in res.locals and locals is available in all my views later on.

    res.locals.csrfToken = req.csrfToken();

    //Now I just need to make sure that once this middleware was executed, the request for which it was executed is able to reach the next middleware or route handler in line, and that can be achieved by calling next this third parameter value.

    next();
}

module.exports = addCsrftoken;


