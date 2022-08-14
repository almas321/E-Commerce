//this function is created for if user details matched then after this we want to update the session 
//we want to log the user in.We want to manipulate the session such that we store some data in it, that this user to which the session belongs should be treated as logged in.
//req->because we'll need that to access the session,
//user-> that we created with all the data that belongs to that user
//action->action that should be executed once the session was updated, so that if we redirect to a protected page, for example, we only redirect one the updated session data

function createUserSession(req,user,action){
    req.session.uid = user._id.toString();      //req.session->This is a property that's made availableby the express session package.
                                                //uid-> You can store any data you want in the session. For example, all store the uid, the user ID
                                                //by accessing user._id.toString.
                                                // _id-> is the ID format used by MongoDB. Internally in the database, every document gets this _id field as a unique identifier.

    req.session.isAdmin = user.isAdmin;  //storing isadmin
 //The save method is coming from the express session package, and that package will execute save when we call this here, and then it will execute action once saving the updated session data to the database is done. So action will only be executedonce the session was successfully saved in the store.               
                                    
 req.session.save(action);
    
}


//after logout for destroying the session

function destroyUserAuthSession(req){
    req.session.uid = null     //Null is a built in value type in JavaScript. And it basically means nothing. There is no value.
    
}






module.exports = {
    createUserSession:createUserSession,
    destroyUserAuthSession:destroyUserAuthSession
};