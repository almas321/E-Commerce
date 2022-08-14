
//retrieving that flash to data
function getSessionData(req){
    const sessionData = req.session.flashData;
    req.session.flashData = null; // to clear that data
    return sessionData;
}

// handle flashing data onto the session.
//req - need the request object because I need that to access the session.
//data - I need the data that should be flashed,
//action - a function that should be executed after the data was stored on the session, because I will explicitly call the safe method on the session and ensure that we then only perform a certain actual, like redirecting after the session data was saved successfully.

function flashDataTosession(req,data,action){
    req.session.flashData = data;         // I'll add flash data as a key here. The key name is up to you though. It's your session object. 
    req.session.save(action);     //save is a built in method.I'll pass action to save because save takes a function as a parameter value and save, or the session package we'll then execute that action once saving succeeded.
}

module.exports ={

    
    flashDataTosession:flashDataTosession,
    getSessionData:getSessionData

};
