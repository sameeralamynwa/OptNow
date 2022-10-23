const express = require('express');
const pageRouter = express.Router();

const {getHome, loginPage,registerPagePatient , registerPageDoctor , registerPageClinic, patientHome} = require ('../controller/pageController');

pageRouter.route('/login')
.get(loginPage);


pageRouter.route('/registerPatient')
.get(registerPagePatient);

pageRouter.route('/registerDoctor')
.get(registerPageDoctor);

pageRouter.route('/registerClinic')
.get(registerPageClinic);

pageRouter.route('/patientHome')
.get(patientHome);
pageRouter.route('/')
.get(getHome);

module.exports = pageRouter;