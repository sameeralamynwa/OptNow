const express = require('express');
const pageRouter = express.Router();

const {getHome, loginPage,registerPagePatient , registerPageDoctor , registerPageClinic, patientHome, registerPatient, registerClinic, registerDoctor, getDocs, selectDoctor, bookDoctor, showPrescriptions, getChemists, login, logout, authPatient, selectDetails, doctorHome, showFeedbacks, showAppointments, authDoctor, enterDetails, giveReport, checkRisk} = require ('../controller/pageController');

pageRouter.route('/login')
.get(loginPage)
.post(login);

pageRouter.route('/registerPatient')
.get(registerPagePatient)
.post(registerPatient);

pageRouter.route('/registerDoctor')
.get(registerPageDoctor)
.post(registerDoctor);

pageRouter.route('/registerClinic')
.get(registerPageClinic)
.post(registerClinic);

pageRouter.route('/patientHome')
.get(authPatient, patientHome);

// pageRouter.route('/apt/:sp/:docId')
// .get(selectDetails);

pageRouter.route('/apt/:sp')
.get(authPatient, getDocs)
// .post(selectDoctor);

pageRouter.route('/book/:docId')
.get(selectDetails);

pageRouter.route('/bookDoctor')
.post(bookDoctor);

pageRouter.route('/viewPrescriptions')
.get(authPatient, showPrescriptions);

pageRouter.route('/viewStores')
.get(authPatient, getChemists);

pageRouter.route('/checkRisk')
.get(authPatient, checkRisk);

pageRouter.route('/doctorHome')
.get(authDoctor, doctorHome);

pageRouter.route('/logout')
.get(logout);

pageRouter.route('/checkAppointments')
.get(authDoctor, showAppointments);
 
pageRouter.route('/checkFeedbacks')
.get(authDoctor, showFeedbacks);

pageRouter.route('/addPrescription')
.get(authDoctor, enterDetails)
.post(authDoctor, giveReport);

pageRouter.route('/')
.get(getHome);



module.exports = pageRouter;