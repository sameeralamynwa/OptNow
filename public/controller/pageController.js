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
        long : location.longitude,
        state : location.state
    });
    // console.log(newClinic);
    // console.log(location);
    return res.json({
        data : newClinic
    });
}

module.exports.registerDoctor = async function registerDoctor(req, res){

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
    console.log(newDoc);
    return res.render('index.ejs', {
        name : "Doctor Registered"
    });
};
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
        // patientId : req.cookies.patientId,
        patientId : "1"
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
    return res.render('bookapt.ejs', {
        name : 'Schedule APT',
        clinic : currClinic,
        doc : currDoc
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

    return res.render('viewPrescriptions.ejs', {
        name : "View Prescriptions",
        records : currUser.records
    });
};



// patientId cookie MUST for performing patient operations