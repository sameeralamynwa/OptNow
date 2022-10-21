const patientModel = require('../models/patientModel.js');

module.exports.getHome = function getHome(req, res) {
    return res.render('index.ejs', {
        name: "HomePage" ,
    });
}
module.exports.loginPage = function loginPage(req, res){
    return res.render('login.ejs', {
        name : "Login"
    });
}

module.exports.patientHome = function patientHome(req, res){
    return res.render('patientHome.ejs', {
        name : "User Profile",
        username : "patient"
    })
}