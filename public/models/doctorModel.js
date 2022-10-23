const mongoose = require('mongoose'); 
const db_link = 'mongodb+srv://admin:23243535@cluster0.xbnsp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then(function (db) {
        console.log('db connected for doctors');
    })
    .catch(function (err) {
        console.log(err);
    });

const doctorSchema = new mongoose.Schema({
    clinicId: {
        type : String , 
        required : true
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type: String
    },
    password : {
        type : String ,
        default : ''
    },
    email: {
        type: String, 
        required : true
    },
    contact : {
        type : String,
        required : true
    },
    alternate_contact : {
        type : String,
    },
    state : {
        type : String
    },
    city : {
        type : String
    },
    lat : {
        type : String,
    },
    lon : {
        type : String
    },
    charges : {
        type : String
    }, 
    degree : {
        type : String
    },
    special : {
        type : String
    },
    zip : {
        type : String
    },
    util : {
        type : String
    }
});

const doctorModel = mongoose.model('doctorSchema' , doctorSchema);

module.exports = doctorModel;