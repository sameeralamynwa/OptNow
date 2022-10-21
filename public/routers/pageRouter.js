const express = require('express');
const pageRouter = express.Router();

const {getHome, loginPage, patientHome} = require ('../controller/pageController');

pageRouter.route('/login')
.get(loginPage);

pageRouter.route('/patientHome')
.get(patientHome);
pageRouter.route('/')
.get(getHome);

module.exports = pageRouter;