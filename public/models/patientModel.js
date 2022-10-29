const mongoose = require('mongoose'); 
const db_link = 'mongodb+srv://admin:23243535@cluster0.xbnsp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then(function (db) {
        console.log('db connected for patients');
    })
    .catch(function (err) {
        console.log(err);
    });

const patientSchema = new mongoose.Schema({
    patientId: {
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
    marital : {
        type : String
    },
    race : {
        type : String
    },
    ethnicity : {
        tyep : String
    },
    gender : {
        type : String
    },

    password : {
        type : String ,
        default : ''
    },
    email  : {
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
    address : {
        type : String
    },
    city : {
        type : String
    },
    country : {
        type : String
    },
    age : {
        type : String,
        required : true
    },
    records : {
        type : [],
    },
    lat : {
        type : String
    },
    long : {
        type : String
    },
    apts : {
        type : []
    },
    pin : {
        type : String
    },
    expenses : {
        type : Number,
        default : 0
    }
});

const patientModel = mongoose.model('patientModel' , patientSchema);

module.exports = patientModel;