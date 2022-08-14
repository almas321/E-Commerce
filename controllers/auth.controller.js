const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res)  //render to signup.ejs 
  {
    let sessionData = sessionFlash.getSessionData(req); //retriving the data from session...calling function from util folder

    if (!sessionData) {
      sessionData = {
        email: '',
        confirmEmail: '',
        password: '',
        fullname: '',
        street: '',
        postal: '',
        city: '',
      };
    }

    res.render('customer/auth/signup', {inputData:sessionData});
  }


async function signup(req,res,next)  //store the signup value in the database
{
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  // now can use this user model to create a new user based on this blueprint with the new keyword.
  
  //before we call user signup and we store all that data. We want to validate that user input,
   
  if(!validation.userDetailsAreValid(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal , req.body.city) ||  !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])) // square bracker because in js - is not allowed to use with . so we cant use req.body.confirm-email
   {
    //calling flashDataTosession function from util
    sessionFlash.flashDataTosession(req, { 
    errorMessage:'Please check your input. Password must be at least 6 character slong, postal code must be 5 characters long.',
    ...enteredData,
    } , 
    
    function(){

        res.redirect('/signup'); //redirecting again to signup page so that the user can enter the correct data
    });
      
        return;                 //if user are not valid no code should be executed
   }
  
  const user = new User(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal , req.body.city);  //with the help of urlencoded middleware now have access to req.body.And then with the dot notation, we can access all the fields we defined in our form.

  
  try{
    const existAlready = await user.existAlready();          //is user is exist already and try to sign up again
  
     if(existAlready){
      sessionFlash.flashDataTosession(req,{
        errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData,
      },function(){

        res.redirect('/signup');  //redirecting back to signup so user can enter new data
      });
      return;
     }
     
    await user.signup();  //Now on that user, we can now call the signUp method,which we defined to store that user in that database,
   } catch(error){
    next(error);
    return;
   }

    res.redirect('/login');      //if everything is valid redirect to login page
  }

//........................ ...................LOGIN....................................................................
  //for serving loging page request
 function getLogin(req,res){
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('customer/auth/login', { inputData: sessionData });
}

  async function login(req,res,next) 
  {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.userWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: 'invalid credentials - please double - check your email and password',
     email:user.email,
     password:user.password,
  };

  if(!existingUser){
    sessionFlash.flashDataTosession(req,sessionErrorData,function(){

      res.redirect('/login')
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);


  if (!passwordIsCorrect) {
    sessionFlash.flashDataTosession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }


  //req -> login function me req hai isliye yaha bhi pass kr skte hai
  //existinguser-> user that is retrived from database
  //function-> anonymous function which acts as action
  //we calling this function from util/authentication.js
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}



//for logging out
function logout(req,res){
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}





// for exporting more than one function, we will export an object which can use to group multiple values or function together

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout:logout,
};