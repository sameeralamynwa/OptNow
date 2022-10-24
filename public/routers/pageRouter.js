const express = require('express');
const pageRouter = express.Router();

const {getHome, loginPage,registerPagePatient , registerPageDoctor , registerPageClinic, patientHome, registerClinic, registerDoctor, getDocs, selectDoctor, bookDoctor} = require ('../controller/pageController');

pageRouter.route('/login')
.get(loginPage);

pageRouter.route('/registerPatient')
.get(registerPagePatient);

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

pageRouter.route('/')
.get(getHome);

module.exports = pageRouter;