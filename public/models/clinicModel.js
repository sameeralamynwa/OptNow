const mongoose = require('mongoose'); 
const db_link = 'mongodb+srv://admin:23243535@cluster0.xbnsp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
    .then(function (db) {
        console.log('db connected for clinic');
    })
    .catch(function (err) {
        console.log(err);
    });

const clinicSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    name : {
        type : String
    },
    email : {
        type : String
    },
    contact : {
        type : String
    },
    alternate_contact : {
        type : String
    },
    address : {
        type : String
    },
    pin : {
        type : String
    },
    city : {
        type : String
    },
    lat : {
        type : String
    },
    long : {
        type : String
    }
});

const clinicModel = mongoose.model('clinicModel' , clinicSchema);

module.exports = clinicModel;