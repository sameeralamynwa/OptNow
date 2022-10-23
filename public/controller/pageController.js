const patientModel = require('../models/patientModel.js');
const doctorModel = require('../models/doctorModel.js');
const clinicModel = require('../models/clinicModel.js');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider : 'opencage',
    apiKey : '6fa8a2bd2e5c4f6c9824bd1e60c21318'
};
const geocoder = NodeGeocoder(options);

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

module.exports.registerClinic = async function registerClinic(req , res){
    let nextId = await clinicModel.countDocuments() + 1;
    // console.log(nextId);
    const resp = await geocoder.geocode({
        address : req.body.address,
        country : "India",
        zipcode : req.body.pin
    });
    let location = resp[0];
    let newClinic = await clinicModel.create({
        id : nextId,
        name : req.body.name,
        email : req.body.email,
        contact : req.body.contact,
        alternate_contact : req.body.alternate_contact,
        address : req.body.address,
        pin : req.body.zipcode,
        city : req.body.city,
        lat : location.latitude,
        long : location.longitude
    });
    // console.log(newClinic);
    return res.render('index.ejs', {
        name : "homepage"
    });
}