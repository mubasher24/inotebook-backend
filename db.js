const mongoose = require("mongoose");

const mongoUri = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo =()=>{

mongoose.connect(mongoUri);

}

module.exports = connectToMongo