const patientModel = require('../models/patientModel.js');
const doctorModel = require('../models/doctorModel.js');
const clinicModel = require('../models/clinicModel.js');
const NodeGeocoder = require('node-geocoder');
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'mykey123';

const options = {
    provider : 'opencage',
    apiKey : '6fa8a2bd2e5c4f6c9824bd1e60c21318'
};
const geocoder = NodeGeocoder(options);

module.exports.getHome = function getHome(req, res) {

    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;
    return res.render('index.ejs', {
        name: "HomePage" ,
        firstName : firstName,
        userType : userType
    });
}

module.exports.loginPage = function loginPage(req, res){
    if (req.cookies.login){
        if (req.cookies.userType == 'Doctor')
            return res.redirect('/doctorHome');
        else return res.redirect('/patientHome');
    }
    else { 
        return res.render('login.ejs', {
            name : "Login",
            firstName : '',
            userType : ''
        });
    } 
}

module.exports.registerPagePatient = function registerPagePatient(req, res){
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;

    return res.render('registerPatient.ejs', {
        name : "Register Patient",
        firstName : firstName,
        userType : userType
    });
}

module.exports.registerPageDoctor = function registerPageDoctor(req, res){
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;
    return res.render('registerDoctor.ejs', {
        name : "Register Doctor",
        firstName : firstName,
        userType : userType
    });
}

module.exports.registerPageClinic = function registerPageClinic(req, res){
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;
    return res.render('registerClinic.ejs', {
        name : "Register Clinic",
        firstName : firstName,
        userType : userType
    });
}

module.exports.patientHome = function patientHome(req, res){
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;

    return res.render('patientHome.ejs', {
        name : "User Profile",
        username : "patient",
        firstName : firstName,
        userType : userType
    })
}

module.exports.registerClinic = async function registerClinic(req , res){
    let nextId = await clinicModel.countDocuments() + 1;
    // console.log(nextId);
    try{ 
        const resp = await geocoder.geocode({
            address : req.body.address,
            countrycode : "in"
            // city : req.body.city
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
            long : location.longitude,
            state : location.state
        });
        // console.log(newClinic);
        return res.send("done");
        }
    catch(err){
        return res.send(err);
    }
}

module.exports.registerDoctor = async function registerDoctor(req, res){

    try{ 
        let hisClinic = await clinicModel.findOne({
            id : req.body.clinicId
        });
        let hisUtil = Math.floor(Math.random() * (100));
        let newDoc = await doctorModel.create({
            clinicId : req.body.clinicId,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : req.body.password,
            email : req.body.email,
            contact : req.body.contact,
            alternate_contact : req.body.alternate_contact,
            state : hisClinic.state,
            city : hisClinic.city,
            lat : hisClinic.lat,
            long : hisClinic.long,
            charges : req.body.charges,
            degree : req.body.degree,
            special : req.body.special,
            pin : hisClinic.pin,
            util : hisUtil
        });
        // console.log(newDoc);
        return res.send('done');
    }
    catch(err){
        return res.send("ERR");
    }
};

module.exports.registerPatient = async function registerPatient(req, res){
    let nextId = await patientModel.countDocuments() + 1;
    const resp = await geocoder.geocode({
        address : req.body.address,
        countrycode : "in"
    });
    try{ 
        let location = resp[0];
        let newUser = await patientModel.create({
            patientId : nextId,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            marital : req.body.marital,
            race : req.body.race,
            ethnicity : req.body.ethnicity,
            gender : req.body.gender,
            age : req.body.age,
            password : req.body.password,
            email : req.body.email,
            contact : req.body.contact,
            alternate_contact : req.body.alternate_contact,
            address : req.body.address,
            pin : location.zipcode,
            city : req.body.city,
            lat : location.latitude,
            long : location.longitude,
            state : location.state,
            country : location.country
        });
        // console.log(newClinic);
        // console.log(location);
        console.log(newUser);
        return res.send("done");
    }catch(err){
        return res.send(err);
    }

}

function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

module.exports.getDocs = async function getDocs(req, res){

    let currUser = await patientModel.findOne({
        patientId : req.cookies.patientId,
        // patientId : "1"
        ////////////////////////////////////
    });
    let allDocs = await doctorModel.find({
        // city : currUser.city,
        special : req.params.sp
    });
    let allClinics = [];
    for(let i = 0; i < allDocs.length; ++i){
        let currClinic = await clinicModel.findOne({
            id : allDocs[i].clinicId
        });
        currClinic.doc = allDocs[i];
        // console.log(currClinic);
        allClinics.push(currClinic)
    }
    // console.log(allClinics);
    allClinics.sort((a, b) =>
    distance(a.lat, a.long, currUser.lat, currUser.long) -
    distance(b.lat, b.long, currUser.lat, currUser.long)
    );
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;

    return res.render('alldocs.ejs', {
        name : "Choose your doctor",
        special : req.params.sp,
        clinics : allClinics,
        firstName : firstName,
        userType : userType
    });
    return res.json({
        // data : "done",
        special : req.params.sp,
        clinics : allClinics
    });
};

module.exports.selectDoctor = async function selectDoctor(req, res){

    let currDoc = await doctorModel.findById(req.body.docId);
    let currClinic = await clinicModel.find({
        id : currDoc.clinicId
    });

    // res.cookie.doc = currDoc;
    // return res.render('bookDoctor.ejs', {
    //     name : 'Book Doctor',  
    //     doc : currDoc
    // });
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;
    return res.render('bookapt.ejs', {
        name : 'Schedule APT',
        clinic : currClinic,
        doc : currDoc,
        firstName : firstName,
        userType : userType
    });
};

module.exports.bookDoctor = async function bookDoctor(req, res){

    let currDoc = await doctorModel.findById(req.body.doctorId);
    // console.log(currDoc);
    let canBook = true;
    if (currDoc)
        for (var i = 0; i < currDoc.apts.length; ++i){
            if (currDoc.apts[i].date == req.body.date &&
                currDoc.apts[i].time == req.body.time)
                canBook = false;
        }
    // console.log(currDoc)
    // console.log(canBook, currDoc.apts);
    if (canBook == true){
        currDoc.apts.push({
            date : req.body.date,
            time : req.body.time,
            patientId : req.cookies.patientId,
            description : req.body.description
        });
        let updated = await doctorModel.findByIdAndUpdate(req.body.doctorId, {apts : currDoc.apts});
        // console.log(updated.apts);
        return res.send({
            data : "APT BOOKED"
        });
    }
    else {
        return res.send({
            data : "CHOOSE ANOTHER SLOT"
        });
    }
    

}

module.exports.showPrescriptions = async function showPrescriptions(req, res){

    let currUser = patientModel.findOne({
        id : req.cookies.patientId
    });
    let firstName = req.cookies.firstName;
    let userType = req.cookies.userType;
    return res.render('viewPrescriptions.ejs', {
        name : "View Prescriptions",
        records : currUser.records,
        firstName : firstName,
        userType : userType
    });
};

module.exports.getChemists = async function getChemists(req, res){
    let currUser = await patientModel.findOne({
        patientId : req.cookies.patientId
        // patientId : "1"
    });
    // console.log(currUser);
    const response = await fetch(`https://api.geoapify.com/v2/places?categories=healthcare.pharmacy,commercial.chemist,healthcare.hospital,healthcare.clinic_or_praxis,commercial.health_and_beauty,healthcare,building.healthcare&bias=proximity:${currUser.long},${currUser.lat}&limit=7&apiKey=c1c4dcb32cc54e2cb89efac279fbb99c`);
    const data = await response.json();
    // return res.render('viewStores.ejs', {
    //     name : "View Stores",
    //     stores : data
    // });
    // console.log(data.features[0]);
    let stores = [];
    for(var i = 0; i < data.features.length; ++i){
        stores.push({
            name : data.features[i].properties.name,
            address : data.features[i].properties.street,
            state : data.features[i].properties.state,
            pincode : data.features[i].properties.postcode,
            distance : data.features[i].properties.distance
        });
    }
    // console.log(stores[0]);
    // let firstName = req.cookies.firstName;
    // let userType = req.cookies.userType;
    // firstName : firstName,
    // userType : userType
    return res.json(stores);
};

module.exports.login = async function login(req, res){

    try{
        if (req.body.strUserType == 'Doctor'){
            let currDoc = await doctorModel.findOne({
                email : req.body.email,
                password : req.body.password
            });
            if (currDoc){
                let uid = currDoc['id'];
                let token  = jwt.sign({payload:uid} , JWT_KEY);
                res.cookie('login' , token, {httpOnly:true});
                // res.cookie('patientId', currUser.patientId , {httpOnly : true});
                res.cookie('userType', 'Doctor', {httpOnly : true});
                res.cookie('firstName', currDoc.firstName, {httpOnly : true});
                return res.send('loggedin');
            }
            else {
                return res.send("Invalid Credentials")
            }
        }
        else {
            let currUser = await patientModel.findOne({
                email : req.body.email,
                password : req.body.password
            });
            if (currUser){
                let uid = currUser['id'];
                let token  = jwt.sign({payload:uid} , JWT_KEY);
                res.cookie('login' , token, {httpOnly:true});
                res.cookie('patientId', currUser.patientId , {httpOnly : true});
                res.cookie('userType', 'Patient', {httpOnly : true});
                res.cookie('firstName', currUser.firstName, {httpOnly : true});
                return res.send('loggedin');
            }
            else {
                return res.send("Invalid Credentials")
            }

        }
    }
    catch(err){
        return res.send(err);
    }
}

module.exports.logout = async function logout(req, res){

    res.cookie('patientId' , '' , {maxAge:1});
    res.cookie('userType' , '' , {maxAge:1});
    res.cookie('login' , '' , {maxAge:1});
    res.cookie('firstName', '', {maxAge:1});
    return res.redirect('/');
}

module.exports.authPatient = async function authPatient(req, res, next){
    
    if (req.cookies.login){
        if (req.cookies.userType == 'Patient'){
            let currPayload = jwt.verify(req.cookies.login , JWT_KEY).payload;
            let currUser = await patientModel.findById(currPayload);
            if (currUser.patientId == req.cookies.patientId)
                next();
            else {
                return res.json("TRY AGAIN");
            }
        }
        else {
            return res.json("ACCESS DENIED, LOGIN AS PATIENT");
        }

    }
    else {
        return res.json("ACCESS DENIED, LOGIN");
    }
}



// patientId cookie MUST for performing patient operations