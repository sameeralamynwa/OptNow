const express = require('express');
const pageRouter = express.Router();

const {getHome, loginPage,registerPagePatient , registerPageDoctor , registerPageClinic, patientHome, registerPatient, registerClinic, registerDoctor, getDocs, selectDoctor, bookDoctor, showPrescriptions, getChemists, login} = require ('../controller/pageController');

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
.get(patientHome);

pageRouter.route('/apt/:sp')
.get(getDocs)
.post(selectDoctor);

pageRouter.route('/bookDoctor')
.post(bookDoctor)

pageRouter.route('/viewPrescriptions')
.get(showPrescriptions)

pageRouter.route('/viewStores')
.get(getChemists);

pageRouter.route('/')
.get(getHome);

module.exports = pageRouter;