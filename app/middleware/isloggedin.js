exports.check = function(req,res,next){
	if(req.session.passport){
		console.log(req.session)
		next();
	}
	else 
		res.redirect('/')
}