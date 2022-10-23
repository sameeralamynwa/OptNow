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

module.exports.registerPagePatient = function registerPagePatient(req, res){
    return res.render('registerPatient.ejs', {
        name : "Register Patient"
    });
}

module.exports.registerPageDoctor = function registerPageDoctor(req, res){
    return res.render('registerDoctor.ejs', {
        name : "Register Doctor"
    });
}

module.exports.registerPageClinic = function registerPageClinic(req, res){
    return res.render('registerClinic.ejs', {
        name : "Register Clinic"
    });
}

module.exports.patientHome = function patientHome(req, res){
    return res.render('patientHome.ejs', {
        name : "User Profile",
        username : "patient"
    })
}