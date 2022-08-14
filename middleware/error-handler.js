//this is a special middleware function because it does not just receive free parameter values, request, response and next, but it actually receives four. It receives the special error parameter value as a first value and expressible call this function whenever we have an error in one of the other middlewares or route handler functions, and then this first parameter value will be an error objects with more details about the error that occured.

//set the status code to 500,which indicates a service site error. We also have other errors like a not found error,

function handleErrors(error, req, res, next) {
    console.log(error);

    if (error.code === 404){
      return res.status(404).render('share/404');
    }
    res.status(500).render('share/500');
  }
  
  module.exports = handleErrors;

